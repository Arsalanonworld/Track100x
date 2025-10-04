
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
    icon?: string;
  };
  value: string;
  amountToken: number;
  network: 'Ethereum' | 'Solana' | 'Bitcoin';
  time: string;
  gasFee: string;
  priceImpact: string;
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

export const whaleTransactions: WhaleTransaction[] = [
  {
    id: '1',
    txHash: '0xabc123def456...',
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    fromShort: '0x742d...f44e',
    fromTags: ['Whale', 'Justin Sun'],
    to: '0x9b5a8b7c6a5d4e3f2e1d0c9b8a7f6e5d4c3b2a1e',
    toShort: '0x9b5a...2a1e',
    toTags: ['CEX', 'Binance'],
    token: {
      symbol: 'ETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    },
    value: '$12.0M',
    amountToken: 4000,
    network: 'Ethereum',
    time: '2m ago',
    gasFee: '$42.50',
    priceImpact: '-0.02%',
  },
  {
    id: '2',
    txHash: '8cdef456abc123...',
    from: 'bc1qylzqr2y8ne6x5wz9s9z2v8q5q5z5c5q5q5q5q5',
    fromShort: 'bc1qy...q5q5',
    to: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    toShort: '3J98t...hWNLy',
    toTags: ['Institution'],
    token: {
      symbol: 'BTC',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
    },
    value: '$50.0M',
    amountToken: 1000,
    network: 'Bitcoin',
    time: '5m ago',
    gasFee: '$10.12',
    priceImpact: 'N/A',
  },
   {
    id: '3',
    txHash: '0xghi789jkl012...',
    from: 'So11111111111111111111111111111111111111112',
    fromShort: 'So11...1112',
    to: '4pUQS4p2KtV3yS5tC4tFzS1vG2vA3eB4c5D6F7G8H9J',
    toShort: '4pUQS...8H9J',
    toTags: ['DEX', 'Raydium'],
    token: {
      symbol: 'SOL',
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    },
    value: '$5.0M',
    amountToken: 50000,
    network: 'Solana',
    time: '8m ago',
    gasFee: '$0.01',
    priceImpact: '-0.15%',
  },
  {
    id: '4',
    txHash: '0xmno345pqr678...',
    from: '0xLargeTraderAddress...',
    fromShort: '0xLarg...ress',
    fromTags: ['Whale'],
    to: '0xExchangeDepositAddress...',
    toShort: '0xExch...ress',
    toTags: ['CEX', 'Kraken'],
    token: {
      symbol: 'USDC',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=032',
    },
    value: '$25.5M',
    amountToken: 25500000,
    network: 'Ethereum',
    time: '12m ago',
    gasFee: '$22.80',
    priceImpact: '0.00%',
  },
  {
    id: '5',
    txHash: 'solanaTxHash...',
    from: 'WifHolderAddress...',
    fromShort: 'WifH...ress',
    fromTags: ['Top Holder'],
    to: 'AnotherSolanaWallet...',
    toShort: 'Anot...llet',
    token: {
      symbol: 'WIF',
      icon: 'https://assets.coingecko.com/coins/images/34041/standard/wif.jpg?1715065403',
    },
    value: '$2.1M',
    amountToken: 700000,
    network: 'Solana',
    time: '15m ago',
    gasFee: '$0.02',
    priceImpact: '+0.80%',
  },
];


export const walletLeaderboard: Wallet[] = [
  {
    rank: 1,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    netWorth: 55200000,
    pnl: 5200000,
    pnlPercent: 10.2,
    activity: 88,
    blockchain: 'Ethereum',
    topHolding: { token: 'ETH', percentage: 65 },
  },
  {
    rank: 2,
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    netWorth: 48100000,
    pnl: -1200000,
    pnlPercent: -2.4,
    activity: 120,
    blockchain: 'All',
  },
  {
    rank: 3,
    address: 'So11111111111111111111111111111111111111112',
    netWorth: 32800000,
    pnl: 850000,
    pnlPercent: 2.6,
    activity: 250,
    blockchain: 'Solana',
  },
  {
    rank: 4,
    address: '0x78901234567890abcdef1234567890abcdef1234',
    netWorth: 29200000,
    pnl: 2300000,
    pnlPercent: 8.5,
    activity: 31,
    blockchain: 'Ethereum',
  },
  {
    rank: 5,
    address: '4pUQS4p2KtV3yS5tC4tFzS1vG2vA3eB4c5D6F7G8H9J',
    netWorth: 17500000,
    pnl: 450000,
    pnlPercent: 2.6,
    activity: 55,
    blockchain: 'Solana',
  },
  {
    rank: 6,
    address: '0xab12cd34ef56ab12cd34ef56ab12cd34ef56ab12',
    netWorth: 15300000,
    pnl: -300000,
    pnlPercent: -1.9,
    activity: 42,
    blockchain: 'Ethereum',
  },
  {
    rank: 7,
    address: '0xcd45ef67ab12cd45ef67ab12cd45ef67ab12cd45',
    netWorth: 11900000,
    pnl: 1500000,
    pnlPercent: 12.8,
    activity: 99,
    blockchain: 'All',
    topHolding: { token: 'USDC', percentage: 80 },
  },
  {
    rank: 8,
    address: '0xef78ab12cd34ef78ab12cd34ef78ab12cd34ef78',
    netWorth: 8700000,
    pnl: -2700000,
    pnlPercent: -31.0,
    activity: 180,
    blockchain: 'Ethereum',
    topHolding: { token: 'RNDR', percentage: 40 },
  },
  {
    rank: 9,
    address: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    netWorth: 6100000,
    pnl: 470000,
    pnlPercent: 7.8,
    activity: 34,
    blockchain: 'Solana',
    topHolding: { token: 'LINK', percentage: 25 },
  },
  {
    rank: 10,
    address: '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
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

    