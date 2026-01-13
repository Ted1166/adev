import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Dashboard } from '@/components/Dashboard';

function AppContent() {
  const { isConnected } = useWallet();
  
  return isConnected ? <Dashboard /> : <ConnectWallet />;
}

const Index = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default Index;