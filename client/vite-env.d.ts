/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_EXPLORER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface EthereumProvider {
  isMetaMask?: boolean
  request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
}

interface Window {
  ethereum?: EthereumProvider
}