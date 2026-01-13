import { motion } from 'framer-motion';
import { Users, Tv, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Package } from '@/types/subscription';
import { shortenAddress } from '@/lib/wallet';
import { usePackageStore } from '@/store/PackageStore';

interface PackageCardProps {
  pkg: Package;
  index: number;
  onSubscribe: (pkg: Package) => void;
}

export function PackageCard({ pkg, index, onSubscribe }: PackageCardProps) {
  const { userSubscriptions } = usePackageStore();
  const isSubscribed = userSubscriptions.has(pkg.id);

  const formattedDate = new Date(pkg.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-hover rounded-2xl overflow-hidden group"
    >
      {/* Header gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-[hsl(185,75%,45%)] to-accent" />
      
      <div className="p-6">
        {/* Title & Creator */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-semibold mb-1 group-hover:text-primary transition-colors">
              {pkg.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {shortenAddress(pkg.creator)}
            </p>
          </div>
          {isSubscribed && (
            <span className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Active
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold gradient-text">
              {pkg.price}
            </span>
            <span className="text-lg text-muted-foreground">ETH</span>
            <span className="text-sm text-muted-foreground ml-1">/ month</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Tv className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-semibold">{pkg.channelCount}</p>
            <p className="text-xs text-muted-foreground">Channels</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-semibold">{pkg.subscriberCount}</p>
            <p className="text-xs text-muted-foreground">Subs</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xs font-medium">{formattedDate}</p>
            <p className="text-xs text-muted-foreground">Created</p>
          </div>
        </div>

        {/* Channels preview */}
        {pkg.channels && pkg.channels.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Included channels:</p>
            <div className="flex flex-wrap gap-2">
              {pkg.channels.slice(0, 3).map((channel) => (
                <span
                  key={channel}
                  className="px-2 py-1 rounded-md bg-secondary text-xs"
                >
                  {channel}
                </span>
              ))}
              {pkg.channels.length > 3 && (
                <span className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                  +{pkg.channels.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Subscribe Button */}
        <Button
          variant={isSubscribed ? "secondary" : "hero"}
          className="w-full"
          onClick={() => onSubscribe(pkg)}
          disabled={isSubscribed}
        >
          {isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
        </Button>
      </div>
    </motion.div>
  );
}