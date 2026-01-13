import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/WalletContext';
import { usePackageStore } from '@/store/PackageStore';
import { toast } from 'sonner';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePackageModal({ isOpen, onClose }: CreatePackageModalProps) {
  const { address } = useWallet();
  const { packages, addPackage } = usePackageStore();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [channelCount, setChannelCount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !channelCount) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate wallet transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPackage = {
      id: packages.length,
      title,
      price,
      channelCount: parseInt(channelCount),
      creator: address || '',
      active: true,
      subscriberCount: 0,
      createdAt: Date.now(),
      channels: [],
    };

    addPackage(newPackage);
    toast.success('Package created successfully!');
    
    // Reset form
    setTitle('');
    setPrice('');
    setChannelCount('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="glass rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-display font-semibold">Create Package</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Package Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Premium Channels"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETH / month)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.05"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels">Number of Channels</Label>
                  <Input
                    id="channels"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={channelCount}
                    onChange={(e) => setChannelCount(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Confirming Transaction...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add Package
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  You'll be prompted to confirm the transaction in your wallet
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}