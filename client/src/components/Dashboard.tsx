import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Tv, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { PackageCard } from '@/components/PackageCard';
import { CreatePackageModal } from '@/components/CreatePackageModal';
import { SubscribeModal } from '@/components/SubscribeModal';
import { usePackageStore } from '@/store/PackageStore';
import { useWallet } from '@/contexts/WalletContext';
import { Package as PackageType } from '@/types/subscription';

export function Dashboard() {
  const { address } = useWallet();
  const { packages, userSubscriptions } = usePackageStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-subs' | 'my-packages'>('browse');

  const myPackages = packages.filter(pkg => pkg.creator.toLowerCase() === address?.toLowerCase());
  const activeSubscriptions = Array.from(userSubscriptions.entries()).map(([id, sub]) => ({
    ...sub,
    package: packages.find(pkg => pkg.id === id)!,
  })).filter(sub => sub.package);

  const stats = [
    { icon: Package, label: 'Total Packages', value: packages.length, color: 'text-primary' },
    { icon: Tv, label: 'Active Subscriptions', value: activeSubscriptions.length, color: 'text-success' },
    { icon: TrendingUp, label: 'My Packages', value: myPackages.length, color: 'text-accent' },
  ];

  const tabs = [
    { id: 'browse', label: 'Browse Packages', count: packages.length },
    { id: 'my-subs', label: 'My Subscriptions', count: activeSubscriptions.length },
    { id: 'my-packages', label: 'My Packages', count: myPackages.length },
  ] as const;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs & Create Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-md text-xs ${
                  activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-background/50'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <Button
            variant="hero"
            onClick={() => setIsCreateModalOpen(true)}
            className="shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add Package
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'browse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.filter(pkg => pkg.active).map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={index}
                  onSubscribe={setSelectedPackage}
                />
              ))}
            </div>
          )}

          {activeTab === 'my-subs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.length > 0 ? (
                activeSubscriptions.map((sub, index) => (
                  <motion.div
                    key={sub.packageId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-hover rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                        <Tv className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">{sub.package.title}</h3>
                        <p className="text-sm text-muted-foreground">{sub.package.channelCount} channels</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires</span>
                        <span>{new Date(sub.endTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span>{sub.totalPaid} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto-renew</span>
                        <span className={sub.autoRenew ? 'text-success' : 'text-muted-foreground'}>
                          {sub.autoRenew ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-muted-foreground mb-6">Browse packages to find channels you want to subscribe to</p>
                  <Button variant="outline" onClick={() => setActiveTab('browse')}>
                    Browse Packages
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPackages.length > 0 ? (
                myPackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    onSubscribe={setSelectedPackage}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">No Packages Created</h3>
                  <p className="text-muted-foreground mb-6">Create your first package to start earning from subscriptions</p>
                  <Button variant="hero" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Create Package
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <SubscribeModal
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </div>
  );
}