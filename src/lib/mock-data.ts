
import type { WhaleTransaction } from './types';

// This is a mock type for demonstration. In a real app, it would be in types.ts
export type TriggeredAlert = {
    id: string;
    rule: string;
    entity: string;
    time: string;
    value: string;
    target?: string;
};


export const whaleTransactions: WhaleTransaction[] = [
  {
    id: '1',
    txHash: '0xabc...def',
    from: '0x1234...5678',
    fromShort: '0x1234',
    fromTags: ['Whale'],
    to: '0x9876...5432',
    toShort: 'Binance',
    toTags: ['CEX'],
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
    },
    tokenAmount: '1,000 ETH',
    value: '$3,500,000',
    network: 'Ethereum',
    time: '2m ago',
    type: 'transfer',
  },
  {
    id: '2',
    txHash: '0xghi...jkl',
    from: '0xabcd...ef12',
    fromShort: '0xabcd',
    fromTags: [],
    to: '0xfedc...ba98',
    toShort: 'Uniswap',
    toTags: ['DEX'],
    token: {
      symbol: 'WIF',
      name: 'dogwifhat',
    },
    tokenAmount: '500,000 WIF',
    value: '$1,200,000',
    network: 'Solana',
    time: '5m ago',
    type: 'swap',
  },
    {
    id: '3',
    txHash: '0x mno...pqr',
    from: '0x5555...6666',
    fromShort: '0x5555',
    to: '0x7777...8888',
    toShort: '0x7777',
    token: {
      symbol: 'USDT',
      name: 'Tether',
    },
    tokenAmount: '2,500,000 USDT',
    value: '$2,500,000',
    network: 'Ethereum',
    time: '8m ago',
    type: 'transfer',
  },
  {
    id: '4',
    txHash: '0xstu...vwx',
    from: '0x9999...aaaa',
    fromShort: '0x9999',
    to: '0xbbbb...cccc',
    toShort: '0xbbbb',
    fromTags: ['Whale'],
    token: {
      symbol: 'WBTC',
      name: 'Wrapped BTC',
    },
    tokenAmount: '50 WBTC',
    value: '$3,250,000',
    network: 'Ethereum',
    time: '12m ago',
    type: 'transfer',
  },
  {
    id: '5',
    txHash: '0xdef...abc',
    from: '0xdddd...eeee',
    fromShort: '0xdddd',
    to: '0xffff...gggg',
    toShort: '0xffff',
    token: {
      symbol: 'BONK',
      name: 'Bonk',
    },
    tokenAmount: '10B BONK',
    value: '$250,000',
    network: 'Solana',
    time: '15m ago',
    type: 'transfer',
  },
   {
    id: '6',
    txHash: '0xzyx...wvu',
    from: '0x1a2b...3c4d',
    fromShort: '0x1a2b',
    to: '0x5e6f...7g8h',
    toShort: 'Coinbase',
    toTags: ['CEX'],
    token: {
      symbol: 'LINK',
      name: 'Chainlink',
    },
    tokenAmount: '150,000 LINK',
    value: '$2,100,000',
    network: 'Ethereum',
    time: '20m ago',
    type: 'transfer',
  },
  {
    id: '7',
    txHash: '0xabc...123',
    from: '0x9876...fedc',
    fromShort: '0x9876',
    to: '0x1234...abcd',
    toShort: '0x1234',
    fromTags: ['Whale'],
    token: {
      symbol: 'SHIB',
      name: 'Shiba Inu',
    },
    tokenAmount: '500B SHIB',
    value: '$8,750,000',
    network: 'Ethereum',
    time: '22m ago',
    type: 'transfer',
  },
  {
    id: '8',
    txHash: '0x456...def',
    from: '0x11aa...22bb',
    fromShort: '0x11aa',
    to: '0x33cc...44dd',
    toShort: 'AAVE',
    toTags: ['Protocol'],
    token: {
      symbol: 'USDC',
      name: 'USD Coin',
    },
    tokenAmount: '5,000,000 USDC',
    value: '$5,000,000',
    network: 'Polygon',
    time: '25m ago',
    type: 'deposit',
  },
  {
    id: '9',
    txHash: '0x789...ghi',
    from: '0xeeff...gg00',
    fromShort: '0xeeff',
to: '0xa1b2...c3d4',
    toShort: '0xa1b2',
    token: {
      symbol: 'AVAX',
      name: 'Avalanche',
    },
    tokenAmount: '50,000 AVAX',
    value: '$1,750,000',
    network: 'Avalanche',
    time: '30m ago',
    type: 'transfer',
  },
  {
    id: '10',
    txHash: '0xjkl...mno',
    from: '0xf0e1...d2c3',
    fromShort: '0xf0e1',
    fromTags: ['Whale'],
    to: '0xb4a5...9687',
    toShort: '0xb4a5',
    token: {
      symbol: 'DOGE',
      name: 'Dogecoin',
    },
    tokenAmount: '10,000,000 DOGE',
    value: '$1,200,000',
    network: 'Dogechain',
    time: '32m ago',
    type: 'transfer',
  },
];


export const triggeredAlerts: TriggeredAlert[] = [
    {
        id: 'alert-1',
        rule: 'Large Transaction',
        entity: '0x1234...5678',
        time: '2m ago',
        value: 'Sent 1,000 ETH ($3.5M)',
        target: 'Binance'
    },
    {
        id: 'alert-2',
        rule: 'Price Change',
        entity: 'WIF',
        time: '1h ago',
        value: 'Price up 15% in 1 hour',
    },
     {
        id: 'alert-3',
        rule: 'Dormant Wallet',
        entity: '0xabcd...ef12',
        time: '3h ago',
        value: 'Wallet active after 98 days',
    }
]
