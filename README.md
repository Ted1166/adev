# 🎬 ADEV Subscription Platform

> Decentralized channel subscriptions powered by Arbitrum

A Web3 subscription platform that enables creators to monetize their content through blockchain-based channel subscriptions. Built with Solidity smart contracts on Arbitrum and a modern React frontend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arbitrum](https://img.shields.io/badge/Arbitrum-Sepolia-blue)](https://sepolia.arbiscan.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636)](https://soliditylang.org/)

## ✨ Features

### For Creators
- 📦 **Create Subscription Packages** - Set your own pricing and channel count
- 💰 **Direct Earnings** - Receive payments directly to your wallet (95% after 2.5% platform fee)
- 📊 **Creator Dashboard** - Track subscribers, earnings, and manage packages
- 🔄 **Flexible Management** - Update pricing, activate/deactivate packages anytime
- 💸 **Instant Withdrawals** - Withdraw your earnings whenever you want

### For Subscribers
- 🎫 **NFT Subscription Receipts** - Each subscription mints an NFT as proof of access
- ⏱️ **Flexible Duration** - Subscribe for 1-24 months
- 🔁 **Auto-Renewal** - Optional automatic subscription renewal
- 📺 **Channel Access** - Access all channels included in your package
- 🔒 **Secure & Decentralized** - Your subscription data lives on the blockchain

### Technical Features
- ⚡ **Layer 2 Scalability** - Built on Arbitrum for low gas fees
- 🛡️ **Security First** - Audited smart contracts with ReentrancyGuard and Pausable
- 🎨 **Modern UI** - Beautiful, responsive interface built with React + TailwindCSS
- 🔗 **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase Wallet, and more
- 📱 **Mobile Friendly** - Works seamlessly on desktop and mobile

## 🏗️ Architecture

```
adev/
├── contracts/              # Smart contracts (Solidity)
│   ├── contracts/
│   │   └── SubscriptionManager.sol
│   ├── scripts/
│   │   ├── deploy.ts
│   │   └── verify.ts
│   └── hardhat.config.ts
│
└── client/                 # Frontend (React + TypeScript)
    ├── src/
    │   ├── components/     # UI components
    │   ├── contracts/      # Contract ABIs
    │   ├── hooks/          # React hooks
    │   ├── lib/            # Utilities
    │   └── types/          # TypeScript types
    └── vite.config.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- MetaMask or another Web3 wallet
- Arbitrum Sepolia testnet ETH ([Get from faucet](https://faucet.quicknode.com/arbitrum/sepolia))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/adev-subscription.git
cd adev-subscription
```

2. **Install contract dependencies**
```bash
cd contracts
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your private key and API keys
```

4. **Deploy smart contract**
```bash
# Deploy to Arbitrum Sepolia testnet
npm run deploy

# Verify contract on Arbiscan
npm run verify
```

5. **Install frontend dependencies**
```bash
cd ../client
npm install
```

6. **Configure frontend**
```bash
cp .env.example .env.local
# Update VITE_CONTRACT_ADDRESS with deployed contract address
```

7. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📝 Smart Contract

### Deployed Addresses

| Network | Contract Address | Explorer |
|---------|-----------------|----------|
| Arbitrum Sepolia | `0x8de977504d2bfF46ecfD153B10cdb9F22715F988` | [View on Arbiscan](https://sepolia.arbiscan.io/address/0x8de977504d2bfF46ecfD153B10cdb9F22715F988) |

### Key Functions

**For Creators:**
```solidity
createPackage(string title, uint256 pricePerMonth, uint256 channelCount)
addChannelToPackage(uint256 packageId, string channel)
updatePackage(uint256 packageId, ...)
togglePackageStatus(uint256 packageId)
withdrawEarnings(uint256 packageId)
```

**For Subscribers:**
```solidity
subscribe(uint256 packageId, uint256 durationMonths, bool autoRenew) payable
renewSubscription(uint256 packageId, uint256 durationMonths) payable
cancelAutoRenewal(uint256 packageId)
```

**View Functions:**
```solidity
getAllActivePackages()
getUserSubscriptions(address user)
hasActiveSubscription(address user, uint256 packageId)
getPackageChannels(uint256 packageId)
```

## 🎯 Usage Guide

### Creating a Package

1. Connect your wallet to Arbitrum Sepolia
2. Click "Creator Dashboard"
3. Click "+ Create Package"
4. Fill in:
   - Package title
   - Price per month (in ETH)
   - Number of channels
   - Channel URLs/names
5. Confirm transaction in wallet

### Subscribing to a Package

1. Browse available packages
2. Select subscription duration (1-24 months)
3. Click "Subscribe"
4. Confirm payment in wallet
5. Receive NFT subscription receipt

### Managing Subscriptions

**As a Creator:**
- View total earnings in Creator Dashboard
- Activate/deactivate packages
- Withdraw earnings anytime
- Track subscriber count

**As a Subscriber:**
- View all active subscriptions in "My Subscriptions"
- See expiration dates and NFT token IDs
- Access channel lists
- Renew expired subscriptions
- Toggle auto-renewal

## 💻 Development

### Running Tests

```bash
cd contracts
npx hardhat test
```

### Local Development

```bash
# Terminal 1 - Start local Hardhat node
cd contracts
npx hardhat node

# Terminal 2 - Deploy to localhost
cd contracts
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3 - Start frontend
cd client
npm run dev
```

### Building for Production

```bash
cd client
npm run build
npm run preview
```

## 🔐 Security

- Smart contracts use OpenZeppelin's audited libraries
- ReentrancyGuard protects against reentrancy attacks
- Pausable allows emergency contract pausing
- Input validation on all functions
- Safe math operations with Solidity 0.8.20+

**⚠️ Security Notice:** This platform is in beta. Use at your own risk. Always verify contracts before interacting.

## 🛠️ Tech Stack

### Smart Contracts
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Ethers.js v6

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Web3Modal + Ethers.js
- Zustand (State Management)
- Framer Motion (Animations)

### Infrastructure
- Arbitrum (Layer 2)
- IPFS (Optional for metadata)
- WalletConnect

## 📊 Contract Economics

- **Platform Fee:** 2.5% (250 basis points)
- **Creator Earnings:** 97.5% of subscription price
- **Gas Fees:** Minimal on Arbitrum L2
- **Subscription Duration:** 1-24 months
- **Payment:** Direct to smart contract, instantly claimable

## 🗺️ Roadmap

- [ ] Add subscription gifting
- [ ] Implement tiered packages
- [ ] Creator revenue analytics
- [ ] Subscriber referral rewards
- [ ] Mobile app (React Native)
- [ ] Multi-chain support
- [ ] DAO governance for platform fees
- [ ] Content access gates via token gating

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for [Arbitrum APAC Mini Hackathon](https://www.hackquest.io/hackathons/Arbitrum-APAC-Mini-Hackathon)
- Powered by [Arbitrum](https://arbitrum.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/adev-subscription/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/adev-subscription/discussions)
- **Twitter:** [@yourhandle](https://twitter.com/yourhandle)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for the decentralized future**