

import type { Timestamp } from "firebase/firestore";

export type UserPlan = 'free' | 'pro';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: UserPlan;
  createdAt: any; // Can be Timestamp or FieldValue
};


export type Alert = {
    id: string;
    alertType: 'wallet' | 'token';
    walletId?: string;
    token?: string;
    rule: string;
    threshold?: number;
    enabled: boolean;
    createdAt: any; // Firebase Timestamp
    userId: string;
};

export type WatchlistItem = {
    id:string;
    identifier: string; // Wallet address or token symbol
    type: 'wallet' | 'token';
    name?: string; // User-defined alias
    createdAt: any; // Firebase Timestamp
    userId: string;
};

export type PortfolioWallet = {
    id: string;
    address: string;
    blockchain: 'ethereum' | 'solana' | 'polygon' | 'bsc';
    name?: string; // User-defined alias
    userId: string;
}
