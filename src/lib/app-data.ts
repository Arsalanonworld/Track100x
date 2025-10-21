
import React from 'react';
import { Bell, Eye, Trophy, Wallet, Zap } from 'lucide-react';

export const featureHighlights = [
    {
        icon: Zap,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: Eye,
        title: 'Unlimited Watchlist',
        description: 'Track as many wallets and tokens as you want, without any limitations.',
    },
    {
        icon: Trophy,
        title: 'Leaderboard Analytics',
        description: 'Discover and learn from the top-performing traders in real-time with our comprehensive leaderboard.',
    },
     {
        icon: Wallet,
        title: 'Full Portfolio Tracking',
        description: 'Link all your wallets and unlock complete historical data and performance insights.',
    },
];

export const pricing = {
  free: {
    name: 'Free',
    description: 'Get a feel for our platform with essential tracking tools.',
    price: '$0',
    features: [
      'Real-time Whale Feed',
      '5 Watchlist Items',
      '5 Active Alerts',
      '1 Linked Wallet',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Unlimited access to every tool for the serious on-chain analyst.',
    priceMonthly: '$7',
    priceYearly: '$6',
    features: [
      'Unlimited Watchlist',
      'Unlimited Alerts & Advanced Builder',
      'Unlimited Linked Wallets',
      'Full Portfolio History & Analytics',
    ],
  },
};


export const features = [
  {
    category: 'Core Features',
    items: [
      { name: 'Real-Time Whale Feed', free: true, pro: true },
      { name: 'Leaderboard Access', free: true, pro: true },
      { name: 'Watchlist', free: '5 items', pro: 'Unlimited' },
    ],
  },
  {
    category: 'Alerts',
    items: [
      { name: 'Quick Alerts', free: '5 active', pro: 'Unlimited' },
      { name: 'Advanced Alert Builder', free: false, pro: true },
    ],
  },
   {
    category: 'Portfolio & Analytics',
    items: [
        { name: 'Link Wallets', free: '1 wallet', pro: 'Unlimited' },
        { name: 'Historical Performance', free: '7-day history', pro: 'Full history' },
    ]
   },
  {
    category: 'Experience',
    items: [
      { name: 'Priority Support', free: false, pro: true },
    ],
  },
];

export const faqs = [
  {
    question: 'Can I cancel my Pro subscription at any time?',
    answer:
      'Yes, you can cancel your subscription at any time from your account page. You will retain Pro access until the end of your current billing period.',
  },
  {
    question: 'What happens to my data and alerts if I downgrade to Free?',
    answer:
      'Your alerts and watchlist items will not be deleted, but they will be deactivated if you exceed the Free plan limits (5 alerts, 5 watched items). You can re-activate them if you upgrade again or reduce your usage to fit within the limits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards. All payments are processed securely through our payment provider, Stripe.',
  },
];
