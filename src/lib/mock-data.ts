export type Transaction = {
  id: string;
  hash: string;
  token: 'BTC' | 'ETH' | 'SOL';
  amountUSD: number;
  amountToken: number;
  from: string;
  to: string;
  blockchain: 'Bitcoin' | 'Ethereum' | 'Solana';
  type: 'Transfer' | 'Swap';
};

export type Wallet = {
  rank: number;
  address: string;
  netWorth: number;
  pnl: number;
  pnlPercent: number;
  activity: number; // Changed to number for tx count
  blockchain: 'Ethereum' | 'Solana' | 'All';
  topHolding?: {
    token: string;
    percentage: number;
  };
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'wallet' | 'token';
};

export const whaleTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0xabc123',
    token: 'ETH',
    amountUSD: 12000000,
    amountToken: 4000,
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x9b5a8b7c6a5d4e3f2e1d0c9b8a7f6e5d4c3b2a1e',
    blockchain: 'Ethereum',
    type: 'Transfer',
  },
  {
    id: '2',
    hash: '8cdef456',
    token: 'BTC',
    amountUSD: 50000000,
    amountToken: 1000,
    from: 'bc1q...',
    to: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    blockchain: 'Bitcoin',
    type: 'Transfer',
  },
  {
    id: '3',
    hash: '0xghi789',
    token: 'SOL',
    amountUSD: 5000000,
    amountToken: 50000,
    from: 'So11111111111111111111111111111111111111112',
    to: '4pUQS4p2KtV3yS5tC4tFzS1vG2vA3eB4c5D6F7G8H9J',
    blockchain: 'Solana',
    type: 'Swap',
  },
  {
    id: '4',
    hash: '0xjkl012',
    token: 'ETH',
    amountUSD: 8000000,
    amountToken: 2667,
    from: '0x5a7d35Cc6634C0532925a3b844Bc454e4438f44a',
    to: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    blockchain: 'Ethereum',
    type: 'Transfer',
  },
    {
    id: '5',
    hash: '0x mno345',
    token: 'SOL',
    amountUSD: 2500000,
    amountToken: 25000,
    from: '5o2a...s2df',
    to: '3pQR...eE4d',
    blockchain: 'Solana',
    type: 'Transfer',
  },
  {
    id: '6',
    hash: '0xpqr678',
    token: 'ETH',
    amountUSD: 15000000,
    amountToken: 5000,
    from: '0x0d...f3A7',
    to: '0x73...eF44',
    blockchain: 'Ethereum',
    type: 'Swap',
  },
];

export const walletLeaderboard: Wallet[] = [
  {
    rank: 1,
    address: '0x1234...aBcd',
    netWorth: 55200000,
    pnl: 5200000,
    pnlPercent: 10.2,
    activity: 88,
    blockchain: 'Ethereum',
    topHolding: { token: 'ETH', percentage: 65 },
  },
  {
    rank: 2,
    address: '0x3456...dEfg',
    netWorth: 48100000,
    pnl: -1200000,
    pnlPercent: -2.4,
    activity: 120,
    blockchain: 'All',
  },
  {
    rank: 3,
    address: '0x5678...gHij',
    netWorth: 32800000,
    pnl: 850000,
    pnlPercent: 2.6,
    activity: 250,
    blockchain: 'Solana',
  },
  {
    rank: 4,
    address: '0x7890...jKlm',
    netWorth: 29200000,
    pnl: 2300000,
    pnlPercent: 8.5,
    activity: 31,
    blockchain: 'Ethereum',
  },
  {
    rank: 5,
    address: '0x9012...mNop',
    netWorth: 17500000,
    pnl: 450000,
    pnlPercent: 2.6,
    activity: 55,
    blockchain: 'Solana',
  },
  {
    rank: 6,
    address: '0xab12...f123',
    netWorth: 15300000,
    pnl: -300000,
    pnlPercent: -1.9,
    activity: 42,
    blockchain: 'Ethereum',
  },
  {
    rank: 7,
    address: '0xcd45...e456',
    netWorth: 11900000,
    pnl: 1500000,
    pnlPercent: 12.8,
    activity: 99,
    blockchain: 'All',
    topHolding: { token: 'USDC', percentage: 80 },
  },
  {
    rank: 8,
    address: '0xef78...d789',
    netWorth: 8700000,
    pnl: -2700000,
    pnlPercent: -31.0,
    activity: 180,
    blockchain: 'Ethereum',
    topHolding: { token: 'RNDR', percentage: 40 },
  },
  {
    rank: 9,
    address: '0x1a2b...b3c4',
    netWorth: 6100000,
    pnl: 470000,
    pnlPercent: 7.8,
    activity: 34,
    blockchain: 'Solana',
    topHolding: { token: 'LINK', percentage: 25 },
  },
  {
    rank: 10,
    address: '0x2b3c...c5d6',
    netWorth: 4500000,
    pnl: 280000,
    pnlPercent: 6.2,
    activity: 72,
    blockchain: 'All',
    topHolding: { token: 'JUP', percentage: 35 },
  },
];


export const mockAlerts: Alert[] = [
    { id: '1', title: 'Vitalik Buterin Wallet', description: 'Transaction Value > $1,000,000', enabled: true, type: 'wallet' },
    { id: '2', title: 'WIF Token', description: 'Price Change > 10%', enabled: true, type: 'token'},
    { id: '3', title: 'Solana DEX Activity', description: 'Swaps > $100k on Solana DEXs.', enabled: false, type: 'wallet' },
];
