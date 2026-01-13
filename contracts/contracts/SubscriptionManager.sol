// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract SubscriptionManager is ERC721, Ownable, ReentrancyGuard, Pausable {
    
    struct Package {
        uint256 id;
        string title;
        uint256 price;
        uint256 channelCount;
        address creator;
        bool active;
        uint256 subscriberCount;
        uint256 createdAt;
    }

    struct Subscription {
        uint256 packageId;
        uint256 startTime;
        uint256 endTime;
        bool autoRenew;
        uint256 tokenId;
        uint256 totalPaid;
    }

    uint256 public packageCount;
    uint256 private tokenIdCounter;
    uint256 public platformFee = 250;
    address public treasury;
    
    mapping(uint256 => Package) public packages;
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    mapping(uint256 => uint256) public creatorEarnings;
    mapping(uint256 => string[]) private packageChannels;
    mapping(address => uint256[]) private userPackages;
    mapping(address => uint256[]) private creatorPackageIds;
    
    event PackageCreated(uint256 indexed id, string title, uint256 price, address indexed creator, uint256 channelCount);
    event PackageUpdated(uint256 indexed id, uint256 newPrice, uint256 newChannelCount);
    event PackageStatusChanged(uint256 indexed id, bool active);
    event Subscribed(address indexed user, uint256 indexed packageId, uint256 durationMonths, uint256 endTime, uint256 tokenId);
    event SubscriptionRenewed(address indexed user, uint256 indexed packageId, uint256 newEndTime);
    event SubscriptionCancelled(address indexed user, uint256 indexed packageId);
    event EarningsWithdrawn(address indexed creator, uint256 indexed packageId, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);

    error InvalidTitle();
    error InvalidPrice();
    error InvalidChannelCount();
    error NotCreator();
    error MaxChannelsReached();
    error InvalidIndex();
    error PackageNotFound();
    error PackageNotActive();
    error InvalidDuration();
    error InsufficientPayment();
    error NoSubscription();
    error AutoRenewDisabled();
    error NoEarnings();
    error NoPackages();
    error TransferFailed();
    error InvalidAddress();
    error MaxFeeExceeded();

    constructor() ERC721("ADEV Subscription", "ADEVS") Ownable(msg.sender) {
        treasury = msg.sender;
    }

    function createPackage(
        string memory title,
        uint256 pricePerMonth,
        uint256 channelCount
    ) external whenNotPaused returns (uint256) {
        if (bytes(title).length == 0) revert InvalidTitle();
        if (pricePerMonth == 0) revert InvalidPrice();
        if (channelCount == 0) revert InvalidChannelCount();

        uint256 packageId = packageCount++;

        packages[packageId] = Package({
            id: packageId,
            title: title,
            price: pricePerMonth,
            channelCount: channelCount,
            creator: msg.sender,
            active: true,
            subscriberCount: 0,
            createdAt: block.timestamp
        });

        creatorPackageIds[msg.sender].push(packageId);

        emit PackageCreated(packageId, title, pricePerMonth, msg.sender, channelCount);
        return packageId;
    }

    function addChannelToPackage(uint256 packageId, string memory channel) external {
        Package storage pkg = packages[packageId];
        if (pkg.creator != msg.sender) revert NotCreator();
        if (packageChannels[packageId].length >= pkg.channelCount) revert MaxChannelsReached();
        
        packageChannels[packageId].push(channel);
    }

    function updateChannelInPackage(uint256 packageId, uint256 channelIndex, string memory newChannel) external {
        Package storage pkg = packages[packageId];
        if (pkg.creator != msg.sender) revert NotCreator();
        if (channelIndex >= packageChannels[packageId].length) revert InvalidIndex();
        
        packageChannels[packageId][channelIndex] = newChannel;
    }

    function subscribe(
        uint256 packageId,
        uint256 durationMonths,
        bool autoRenew
    ) external payable nonReentrant whenNotPaused {
        if (packageId >= packageCount) revert PackageNotFound();
        Package storage pkg = packages[packageId];
        if (!pkg.active) revert PackageNotActive();
        if (durationMonths == 0 || durationMonths > 24) revert InvalidDuration();

        uint256 totalCost = pkg.price * durationMonths;
        if (msg.value < totalCost) revert InsufficientPayment();

        Subscription storage sub = subscriptions[msg.sender][packageId];
        
        uint256 endTime;
        
        if (sub.endTime > block.timestamp) {
            endTime = sub.endTime + (durationMonths * 30 days);
            sub.endTime = endTime;
            sub.totalPaid += totalCost;
            sub.autoRenew = autoRenew;
        } else {
            endTime = block.timestamp + (durationMonths * 30 days);
            uint256 newTokenId = tokenIdCounter++;
            
            subscriptions[msg.sender][packageId] = Subscription({
                packageId: packageId,
                startTime: block.timestamp,
                endTime: endTime,
                autoRenew: autoRenew,
                tokenId: newTokenId,
                totalPaid: totalCost
            });

            _safeMint(msg.sender, newTokenId);
            userPackages[msg.sender].push(packageId);
            pkg.subscriberCount++;
        }

        uint256 fee = (totalCost * platformFee) / 10000;
        uint256 creatorAmount = totalCost - fee;

        creatorEarnings[packageId] += creatorAmount;

        (bool success, ) = payable(treasury).call{value: fee}("");
        if (!success) revert TransferFailed();

        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit Subscribed(msg.sender, packageId, durationMonths, endTime, sub.tokenId);
    }

    function renewSubscription(
        uint256 packageId,
        uint256 durationMonths
    ) external payable nonReentrant whenNotPaused {
        Subscription storage sub = subscriptions[msg.sender][packageId];
        if (sub.startTime == 0) revert NoSubscription();

        Package storage pkg = packages[packageId];
        if (!pkg.active) revert PackageNotActive();
        if (durationMonths == 0 || durationMonths > 24) revert InvalidDuration();

        uint256 totalCost = pkg.price * durationMonths;
        if (msg.value < totalCost) revert InsufficientPayment();

        uint256 extensionStart = sub.endTime > block.timestamp ? sub.endTime : block.timestamp;
        sub.endTime = extensionStart + (durationMonths * 30 days);
        sub.totalPaid += totalCost;

        uint256 fee = (totalCost * platformFee) / 10000;
        creatorEarnings[packageId] += (totalCost - fee);

        (bool success, ) = payable(treasury).call{value: fee}("");
        if (!success) revert TransferFailed();

        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit SubscriptionRenewed(msg.sender, packageId, sub.endTime);
    }

    function cancelAutoRenewal(uint256 packageId) external {
        Subscription storage sub = subscriptions[msg.sender][packageId];
        if (sub.startTime == 0) revert NoSubscription();
        if (!sub.autoRenew) revert AutoRenewDisabled();
        
        sub.autoRenew = false;
        emit SubscriptionCancelled(msg.sender, packageId);
    }

    function updatePackage(
        uint256 packageId,
        string memory newTitle,
        uint256 newPrice,
        uint256 newChannelCount
    ) external {
        Package storage pkg = packages[packageId];
        if (pkg.creator != msg.sender) revert NotCreator();
        if (bytes(newTitle).length == 0) revert InvalidTitle();
        if (newPrice == 0) revert InvalidPrice();
        if (newChannelCount == 0) revert InvalidChannelCount();

        pkg.title = newTitle;
        pkg.price = newPrice;
        pkg.channelCount = newChannelCount;

        emit PackageUpdated(packageId, newPrice, newChannelCount);
    }

    function togglePackageStatus(uint256 packageId) external {
        Package storage pkg = packages[packageId];
        if (pkg.creator != msg.sender) revert NotCreator();
        
        pkg.active = !pkg.active;
        emit PackageStatusChanged(packageId, pkg.active);
    }

    function withdrawEarnings(uint256 packageId) external nonReentrant {
        Package storage pkg = packages[packageId];
        if (pkg.creator != msg.sender) revert NotCreator();
        
        uint256 amount = creatorEarnings[packageId];
        if (amount == 0) revert NoEarnings();

        creatorEarnings[packageId] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit EarningsWithdrawn(msg.sender, packageId, amount);
    }

    function withdrawAllEarnings() external nonReentrant {
        uint256[] memory pkgIds = creatorPackageIds[msg.sender];
        if (pkgIds.length == 0) revert NoPackages();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < pkgIds.length; i++) {
            uint256 amount = creatorEarnings[pkgIds[i]];
            if (amount > 0) {
                creatorEarnings[pkgIds[i]] = 0;
                totalAmount += amount;
            }
        }

        if (totalAmount == 0) revert NoEarnings();
        
        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        if (!success) revert TransferFailed();

        emit EarningsWithdrawn(msg.sender, 0, totalAmount);
    }

    function hasActiveSubscription(address user, uint256 packageId) 
        public 
        view 
        returns (bool) 
    {
        return subscriptions[user][packageId].endTime > block.timestamp;
    }

    function getPackageChannels(uint256 packageId) 
        external 
        view 
        returns (string[] memory) 
    {
        return packageChannels[packageId];
    }

    function getSubscriptionInfo(address user, uint256 packageId) 
        external 
        view 
        returns (Subscription memory) 
    {
        return subscriptions[user][packageId];
    }

    function getUserSubscriptions(address user)
        external
        view
        returns (uint256[] memory activePackages, Subscription[] memory subs)
    {
        uint256[] memory userPkgs = userPackages[user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < userPkgs.length; i++) {
            if (hasActiveSubscription(user, userPkgs[i])) {
                activeCount++;
            }
        }

        activePackages = new uint256[](activeCount);
        subs = new Subscription[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < userPkgs.length; i++) {
            if (hasActiveSubscription(user, userPkgs[i])) {
                activePackages[index] = userPkgs[i];
                subs[index] = subscriptions[user][userPkgs[i]];
                index++;
            }
        }

        return (activePackages, subs);
    }

    function getCreatorPackages(address creator) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return creatorPackageIds[creator];
    }

    function getAllActivePackages() 
        external 
        view 
        returns (Package[] memory) 
    {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < packageCount; i++) {
            if (packages[i].active) {
                activeCount++;
            }
        }

        Package[] memory activePackages = new Package[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < packageCount; i++) {
            if (packages[i].active) {
                activePackages[index] = packages[i];
                index++;
            }
        }

        return activePackages;
    }

    function getTotalEarnings(address creator) 
        external 
        view 
        returns (uint256) 
    {
        uint256[] memory pkgIds = creatorPackageIds[creator];
        uint256 total = 0;

        for (uint256 i = 0; i < pkgIds.length; i++) {
            total += creatorEarnings[pkgIds[i]];
        }

        return total;
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        if (newFee > 1000) revert MaxFeeExceeded();
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert InvalidAddress();
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawTreasuryFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        uint256 totalCreatorEarnings = 0;

        for (uint256 i = 0; i < packageCount; i++) {
            totalCreatorEarnings += creatorEarnings[i];
        }

        uint256 treasuryBalance = balance - totalCreatorEarnings;
        if (treasuryBalance == 0) revert NoEarnings();

        (bool success, ) = payable(treasury).call{value: treasuryBalance}("");
        if (!success) revert TransferFailed();
    }

    receive() external payable {}
}