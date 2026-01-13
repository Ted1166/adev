import { useMemo } from 'react'
import { Contract, BrowserProvider } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { SUBSCRIPTION_ABI, CONTRACT_ADDRESS } from '../contracts/abi'

export function useContract() {
  const { walletProvider } = useWeb3ModalProvider()
  const { isConnected } = useWeb3ModalAccount()

  const contract = useMemo(() => {
    if (!walletProvider || !isConnected) return null

    const provider = new BrowserProvider(walletProvider)
    return async () => {
      const signer = await provider.getSigner()
      return new Contract(CONTRACT_ADDRESS, SUBSCRIPTION_ABI, signer)
    }
  }, [walletProvider, isConnected])

  const readContract = useMemo(() => {
    if (!walletProvider) return null

    const provider = new BrowserProvider(walletProvider)
    return new Contract(CONTRACT_ADDRESS, SUBSCRIPTION_ABI, provider)
  }, [walletProvider])

  return { contract, readContract, isConnected }
}