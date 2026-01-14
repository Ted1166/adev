import { motion } from 'framer-motion';
import { Wallet, LogOut, AlertTriangle} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { shortenAddress, formatETH } from '@/lib/wallet';

export function Header() {
  const { address, balance, isCorrectNetwork, switchNetwork, disconnect } = useWallet();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass border-b border-border/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">
            <span className="gradient-text">ADEV</span>
          </span>
        </motion.div>

        {/* Wallet Info */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {!isCorrectNetwork && (
            <Button
              variant="destructive"
              size="sm"
              onClick={switchNetwork}
              className="gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Switch to Arbitrum
            </Button>
          )}

          <div className="glass rounded-xl px-4 py-2 flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-sm font-medium">{formatETH(balance)} ETH</p>
            </div>
            
            <div className="w-px h-8 bg-border" />
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-mono">{shortenAddress(address || '')}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={disconnect}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}