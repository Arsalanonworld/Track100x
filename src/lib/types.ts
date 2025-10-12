

import type { Timestamp } from "firebase/firestore";

export type UserPlan = 'free' | 'pro';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: UserPlan;
  createdAt: any; // Can be Timestamp or FieldValue
  alertsCount?: number;
};

export type AlertCondition = {
  type: string; // e.g., 'transactionValue', 'priceChange'
  threshold: number;
  direction?: 'in' | 'out' | 'any';
  tokenFilter?: string;
};

export type Alert = {
    id: string;
    type: 'quick' | 'advanced'; // Type of alert
    alertType: 'wallet' | 'token';
    walletId?: string;
    token?: string;
    rule: string; // See backend.json for full list of enums
    threshold?: number;
    enabled: boolean;
    createdAt: any; // Firebase Timestamp
    userId: string;
    // Quick Alert specific fields
    direction?: 'in' | 'out' | 'any';
    tokenFilter?: string;
    // Advanced Alert specific fields
    conditions?: AlertCondition[];
    logicalOperator?: 'AND' | 'OR';
    name?: string;
};

export type WatchlistItem = {
    id:string;
    identifier: string; // Wallet address or token symbol
    type: 'wallet' | 'token';
    name?: string; // User-defined alias
    createdAt: any; // Firebase Timestamp
    userId: string;
};

export type WhaleTransaction = {
  id: string;
  txHash: string;
  from: string;
  fromShort: string;
  fromTags?: string[];
  to: string;
  toShort: string;
  toTags?: string[];
  token: {
    symbol: string;
    name: string;
  };
  tokenAmount: string;
  value: string;
  network: string;
  time: string;
  type: 'transfer' | 'swap' | string;
};
    
export type TriggeredAlert = {
    id: string;
    rule: string;
    entity: string;
    time: string;
    value: string;
    target?: string;
};

export type LeaderboardWallet = {
    address: string;
    netWorth: string;
    topHolding: { token: string; percentage: number };
    pnl7d: number;
    winRate: number;
    activity: number;
    tags?: string[];
};

    
