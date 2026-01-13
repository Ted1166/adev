import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // Get from https://cloud.walletconnect.com

const arbitrumSepolia = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.arbiscan.io',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc'
}

const metadata = {
  name: 'ADEV Subscription',
  description: 'Decentralized Subscription Platform',
  url: 'https://adev.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
})

createWeb3Modal({
  ethersConfig,
  chains: [arbitrumSepolia],
  projectId,
  enableAnalytics: false,
  themeMode: 'dark',
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}