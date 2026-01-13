import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Package } from '@/types/subscription';
import { usePackageStore } from '@/store/PackageStore';
import { toast } from 'sonner';

interface SubscribeModalProps {
  pkg: Package | null;
  onClose: () => void;
}

export function SubscribeModal({ pkg, onClose }: SubscribeModalProps) {
  const { addSubscription } = usePackageStore();
  const [duration, setDuration] = useState(1);
  const [autoRenew, setAutoRenew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pkg) return null;

  const totalCost = (parseFloat(pkg.price) * duration).toFixed(3);

  const handleSubscribe = async () => {
    setIsSubmitting(true);

    // Simulate wallet transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    addSubscription(pkg.id, {
      packageId: pkg.id,
      startTime: Date.now(),
      endTime: Date.now() + duration * 30 * 24 * 60 * 60 * 1000,
      autoRenew,
      tokenId: Math.floor(Math.random() * 1000000),
      totalPaid: totalCost,
    });

    toast.success('Subscription activated!');
    setIsSubmitting(false);
    onClose();
  };

  const durationOptions = [
    { months: 1, label: '1 Month', discount: null },
    { months: 3, label: '3 Months', discount: '5% off' },
    { months: 6, label: '6 Months', discount: '10% off' },
    { months: 12, label: '12 Months', discount: '20% off' },
  ];

  return (
    <AnimatePresence>
      {pkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="glass rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-semibold">Subscribe to Package</h2>
                      <p className="text-sm text-muted-foreground">{pkg.title}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label>Subscription Duration</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {durationOptions.map((option) => (
                      <button
                        key={option.months}
                        onClick={() => setDuration(option.months)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          duration === option.months
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 bg-secondary/30 hover:border-border'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {(parseFloat(pkg.price) * option.months).toFixed(3)} ETH
                          </p>
                        </div>
                        {option.discount && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-success/20 text-success text-xs font-medium">
                            {option.discount}
                          </span>
                        )}
                        {duration === option.months && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-renew */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium">Auto-renew subscription</p>
                    <p className="text-xs text-muted-foreground">Automatically renew when expires</p>
                  </div>
                  <button
                    onClick={() => setAutoRenew(!autoRenew)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoRenew ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <motion.div
                      animate={{ x: autoRenew ? 24 : 2 }}
                      className="w-5 h-5 rounded-full bg-white"
                    />
                  </button>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly price</span>
                    <span>{pkg.price} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{duration} {duration === 1 ? 'month' : 'months'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Channels</span>
                    <span>{pkg.channelCount} channels</span>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-display font-bold gradient-text">
                        {totalCost} ETH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You'll be prompted to confirm the transaction in your wallet
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}