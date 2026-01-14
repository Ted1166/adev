export const SUBSCRIPTION_ABI = [
  "function createPackage(string memory title, uint256 pricePerMonth, uint256 channelCount) external returns (uint256)",
  "function addChannelToPackage(uint256 packageId, string memory channel) external",
  "function subscribe(uint256 packageId, uint256 durationMonths, bool autoRenew) external payable",
  "function renewSubscription(uint256 packageId, uint256 durationMonths) external payable",
  "function cancelAutoRenewal(uint256 packageId) external",
  "function updatePackage(uint256 packageId, string memory newTitle, uint256 newPrice, uint256 newChannelCount) external",
  "function togglePackageStatus(uint256 packageId) external",
  "function withdrawEarnings(uint256 packageId) external",
  "function withdrawAllEarnings() external",
  "function hasActiveSubscription(address user, uint256 packageId) external view returns (bool)",
  "function getPackageChannels(uint256 packageId) external view returns (string[] memory)",
  "function getSubscriptionInfo(address user, uint256 packageId) external view returns (tuple(uint256 packageId, uint256 startTime, uint256 endTime, bool autoRenew, uint256 tokenId, uint256 totalPaid))",
  "function getUserSubscriptions(address user) external view returns (uint256[] memory activePackages, tuple(uint256 packageId, uint256 startTime, uint256 endTime, bool autoRenew, uint256 tokenId, uint256 totalPaid)[] memory subs)",
  "function getCreatorPackages(address creator) external view returns (uint256[] memory)",
  "function getAllActivePackages() external view returns (tuple(uint256 id, string title, uint256 price, uint256 channelCount, address creator, bool active, uint256 subscriberCount, uint256 createdAt)[] memory)",
  "function getTotalEarnings(address creator) external view returns (uint256)",
  "function packages(uint256) external view returns (uint256 id, string title, uint256 price, uint256 channelCount, address creator, bool active, uint256 subscriberCount, uint256 createdAt)",
  "function packageCount() external view returns (uint256)",
  "function platformFee() external view returns (uint256)",
  "event PackageCreated(uint256 indexed id, string title, uint256 price, address indexed creator, uint256 channelCount)",
  "event Subscribed(address indexed user, uint256 indexed packageId, uint256 durationMonths, uint256 endTime, uint256 tokenId)",
  "event SubscriptionRenewed(address indexed user, uint256 indexed packageId, uint256 newEndTime)",
  "event EarningsWithdrawn(address indexed creator, uint256 indexed packageId, uint256 amount)"
] as const;

export const CONTRACT_ADDRESS = (import.meta as any).env.VITE_CONTRACT_ADDRESS as string;
export const CHAIN_ID = parseInt((import.meta as any).env.VITE_CHAIN_ID || "421614");
export const EXPLORER_URL = (import.meta as any).env.VITE_EXPLORER_URL as string;
