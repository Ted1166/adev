import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Clock, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Package } from '@/types/subscription';
import { usePackageStore } from '@/store/PackageStore';
import { toast } from 'sonner';

interface SubscribeModalProps {
  pkg: Package | null;
  onClose: () => void;
}

const durationOptions = [
  { months: 1, label: '1 Month', discount: 0 },
  { months: 3, label: '3 Months', discount: 5 },
  { months: 6, label: '6 Months', discount: 10 },
  { months: 12, label: '1 Year', discount: 20 },
];

export function SubscribeModal({ pkg, onClose }: SubscribeModalProps) {
  const { addSubscription, updatePackage } = usePackageStore();
  const [duration, setDuration] = useState(1);
  const [autoRenew, setAutoRenew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pkg) return null;

  const selectedOption = durationOptions.find(d => d.months === duration) || durationOptions[0];
  const basePrice = parseFloat(pkg.price) * duration;
  const discount = basePrice * (selectedOption.discount / 100);
  const finalPrice = basePrice - discount;

  const handleSubscribe = async () => {
    setIsSubmitting(true);

    // Simulate wallet transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const subscription = {
      packageId: pkg.id,
      startTime: Date.now(),
      endTime: Date.now() + duration * 30 * 24 * 60 * 60 * 1000,
      autoRenew,
      tokenId: Math.floor(Math.random() * 100000),
      totalPaid: finalPrice.toString(),
    };

    addSubscription(pkg.id, subscription);
    updatePackage(pkg.id, { subscriberCount: pkg.subscriberCount + 1 });
    
    toast.success(`Successfully subscribed to ${pkg.title}!`);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {pkg && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="glass rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-semibold">Subscribe to {pkg.title}</h2>
                    <p className="text-sm text-muted-foreground">{pkg.channelCount} channels included</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Select Duration
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {durationOptions.map((option) => (
                      <button
                        key={option.months}
                        type="button"
                        onClick={() => setDuration(option.months)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          duration === option.months
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold">{option.label}</p>
                        {option.discount > 0 && (
                          <p className="text-xs text-success">Save {option.discount}%</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Renew */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Repeat className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Auto-renew</p>
                      <p className="text-xs text-muted-foreground">Automatically renew subscription</p>
                    </div>
                  </div>
                  <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price ({duration} {duration === 1 ? 'month' : 'months'})</span>
                    <span>{basePrice.toFixed(4)} ETH</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount ({selectedOption.discount}%)</span>
                      <span>-{discount.toFixed(4)} ETH</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border/50 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-display font-bold gradient-text">{finalPrice.toFixed(4)} ETH</span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  variant="hero"
                  size="lg"
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
                      Confirming Transaction...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Confirm Subscription
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Payment will be processed on the Arbitrum network. Gas fees may apply.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}