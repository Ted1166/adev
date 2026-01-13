import { create } from 'zustand';
import { Package, Subscription } from '@/types/subscription';

interface PackageStore {
  packages: Package[];
  userSubscriptions: Map<number, Subscription>;
  isLoading: boolean;
  
  // Actions
  addPackage: (pkg: Package) => void;
  updatePackage: (id: number, updates: Partial<Package>) => void;
  removePackage: (id: number) => void;
  setPackages: (packages: Package[]) => void;
  
  addSubscription: (packageId: number, subscription: Subscription) => void;
  removeSubscription: (packageId: number) => void;
  
  setLoading: (loading: boolean) => void;
}

// Demo packages for testing
const demoPackages: Package[] = [
  {
    id: 0,
    title: "Starter Pack",
    price: "0.01",
    channelCount: 5,
    creator: "0x1234567890123456789012345678901234567890",
    active: true,
    subscriberCount: 12,
    createdAt: Date.now() - 86400000 * 30,
    channels: ["General", "Updates", "Support", "Tutorials", "Community"],
  },
  {
    id: 1,
    title: "Pro Channels",
    price: "0.05",
    channelCount: 15,
    creator: "0x2345678901234567890123456789012345678901",
    active: true,
    subscriberCount: 45,
    createdAt: Date.now() - 86400000 * 15,
    channels: ["Premium Content", "Live Streams", "Exclusive Drops"],
  },
  {
    id: 2,
    title: "Enterprise Suite",
    price: "0.1",
    channelCount: 50,
    creator: "0x3456789012345678901234567890123456789012",
    active: true,
    subscriberCount: 8,
    createdAt: Date.now() - 86400000 * 7,
    channels: ["API Access", "Priority Support", "Custom Integrations"],
  },
];

export const usePackageStore = create<PackageStore>((set) => ({
  packages: demoPackages,
  userSubscriptions: new Map(),
  isLoading: false,
  
  addPackage: (pkg) => set((state) => ({
    packages: [...state.packages, pkg],
  })),
  
  updatePackage: (id, updates) => set((state) => ({
    packages: state.packages.map((pkg) =>
      pkg.id === id ? { ...pkg, ...updates } : pkg
    ),
  })),
  
  removePackage: (id) => set((state) => ({
    packages: state.packages.filter((pkg) => pkg.id !== id),
  })),
  
  setPackages: (packages) => set({ packages }),
  
  addSubscription: (packageId, subscription) => set((state) => {
    const newSubs = new Map(state.userSubscriptions);
    newSubs.set(packageId, subscription);
    return { userSubscriptions: newSubs };
  }),
  
  removeSubscription: (packageId) => set((state) => {
    const newSubs = new Map(state.userSubscriptions);
    newSubs.delete(packageId);
    return { userSubscriptions: newSubs };
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));