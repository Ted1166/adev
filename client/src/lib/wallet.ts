import { BrowserProvider, JsonRpcSigner, formatEther, Contract, parseEther } from 'ethers'
import { SUBSCRIPTION_ABI, CONTRACT_ADDRESS } from '@/contracts/abi'

interface EthereumProvider {
  request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>
}

export interface WalletState {
  address: string | null
  balance: string
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export const ARBITRUM_CHAIN_ID = 42161
export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614

export const ARBITRUM_SEPOLIA_NETWORK = {
  chainId: `0x${ARBITRUM_SEPOLIA_CHAIN_ID.toString(16)}`,
  chainName: 'Arbitrum Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
}

export const ARBITRUM_NETWORK = {
  chainId: `0x${ARBITRUM_CHAIN_ID.toString(16)}`,
  chainName: 'Arbitrum One',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io/'],
}

export async function connectWallet(): Promise<{
  provider: BrowserProvider
  signer: JsonRpcSigner
  address: string
}> {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet')
  }

  const provider = new BrowserProvider(window.ethereum as any)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { provider, signer, address }
}

export async function switchToArbitrum(testnet = true): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No wallet detected')
  }

  const network = testnet ? ARBITRUM_SEPOLIA_NETWORK : ARBITRUM_NETWORK

  try {
    await (window.ethereum as unknown as EthereumProvider).request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await (window.ethereum as unknown as EthereumProvider).request({
        method: 'wallet_addEthereumChain',
        params: [network],
      })
    } else {
      throw switchError
    }
  }
}

export async function getBalance(address: string): Promise<string> {
  if (!window.ethereum) return '0'

  const provider = new BrowserProvider(window.ethereum as any)
  const balance = await provider.getBalance(address)
  return formatEther(balance)
}

export async function getChainId(): Promise<number | null> {
  if (!window.ethereum) return null

  const provider = new BrowserProvider(window.ethereum as any)
  const network = await provider.getNetwork()
  return Number(network.chainId)
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatETH(value: string | number, decimals = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toFixed(decimals)
}

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }
  return new BrowserProvider(window.ethereum as any)
}

export async function getSigner() {
  const provider = await getProvider()
  return await provider.getSigner()
}

export async function getContract() {
  const signer = await getSigner()
  return new Contract(CONTRACT_ADDRESS, SUBSCRIPTION_ABI, signer)
}

export async function createPackage(title: string, priceEth: string, channels: string[]) {
  const contract = await getContract()
  const price = parseEther(priceEth)
  const tx = await (contract as any).createPackage(title, price, channels.length, channels)
  return await tx.wait()
}

export async function subscribe(packageId: number, months: number, priceEth: string) {
  const contract = await getContract()
  const value = parseEther((parseFloat(priceEth) * months).toString())
  const tx = await (contract as any).subscribe(packageId, months, true, { value })
  return await tx.wait()
}

export async function getAllPackages() {
  const contract = await getContract()
  return await (contract as any).getAllActivePackages()
}