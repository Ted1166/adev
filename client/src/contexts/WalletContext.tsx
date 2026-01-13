import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  WalletState, 
  connectWallet, 
  switchToArbitrum, 
  getBalance, 
  getChainId, 
  ARBITRUM_CHAIN_ID,
  ARBITRUM_SEPOLIA_CHAIN_ID 
} from '@/lib/wallet';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  isCorrectNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: '0',
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const isCorrectNetwork = state.chainId === ARBITRUM_CHAIN_ID || state.chainId === ARBITRUM_SEPOLIA_CHAIN_ID;

  const updateBalance = useCallback(async (address: string) => {
    const balance = await getBalance(address);
    setState(prev => ({ ...prev, balance }));
  }, []);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const { address } = await connectWallet();
      const chainId = await getChainId();
      const balance = await getBalance(address);
      
      setState({
        address,
        balance,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      localStorage.setItem('walletConnected', 'true');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      balance: '0',
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
    localStorage.removeItem('walletConnected');
  }, []);

  const switchNetwork = useCallback(async () => {
    try {
      await switchToArbitrum();
      const chainId = await getChainId();
      setState(prev => ({ ...prev, chainId }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to switch network',
      }));
    }
  }, []);

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected') === 'true';
    if (wasConnected && typeof window.ethereum !== 'undefined') {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.address) {
        setState(prev => ({ ...prev, address: accounts[0] }));
        updateBalance(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.address, disconnect, updateBalance]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, switchNetwork, isCorrectNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}