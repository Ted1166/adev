export interface Package {
  id: number;
  title: string;
  price: string; // In ETH
  channelCount: number;
  creator: string;
  active: boolean;
  subscriberCount: number;
  createdAt: number;
  channels?: string[];
}

export interface Subscription {
  packageId: number;
  startTime: number;
  endTime: number;
  autoRenew: boolean;
  tokenId: number;
  totalPaid: string;
}

export interface UserSubscription extends Subscription {
  package: Package;
}

export interface CreatePackageForm {
  title: string;
  price: string;
  channelCount: number;
}