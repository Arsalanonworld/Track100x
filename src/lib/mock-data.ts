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
  activity: 'High' | 'Medium' | 'Low';
  blockchain: 'Ethereum' | 'Solana' | 'All';
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
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
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    netWorth: 1250000000,
    pnl: 5200000,
    pnlPercent: 4.3,
    activity: 'High',
    blockchain: 'Ethereum',
  },
  {
    rank: 2,
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    netWorth: 850000000,
    pnl: -1200000,
    pnlPercent: -1.4,
    activity: 'Medium',
    blockchain: 'All',
  },
  {
    rank: 3,
    address: '4pUQS4p2KtV3yS5tC4tFzS1vG2vA3eB4c5D6F7G8H9J',
    netWorth: 550000000,
    pnl: 850000,
    pnlPercent: 1.5,
    activity: 'High',
    blockchain: 'Solana',
  },
  {
    rank: 4,
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    netWorth: 320000000,
    pnl: 2300000,
    pnlPercent: 7.2,
    activity: 'Low',
    blockchain: 'Ethereum',
  },
  {
    rank: 5,
    address: 'So11111111111111111111111111111111111111112',
    netWorth: 210000000,
    pnl: 450000,
    pnlPercent: 2.1,
    activity: 'Medium',
    blockchain: 'Solana',
  },
];

export const mockAlerts: Alert[] = [
    { id: '1', title: 'Large ETH Transfer', description: 'Notify when a wallet moves more than 1,000 ETH.', enabled: true },
    { id: '2', title: 'New Token Purchase', description: 'Notify when a top 100 wallet buys a new token.', enabled: true },
    { id: '3', title: 'Solana DEX Activity', description: 'Notify for swaps over $100k on Solana DEXs.', enabled: false },
];
