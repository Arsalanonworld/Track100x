
import React from 'react';
import { Bell, Eye, Wallet, Zap } from 'lucide-react';

export const featureHighlights = [
    {
        icon: Zap,
        title: 'Real-Time Alerts',
        description: 'Set up simple or advanced alerts to monitor specific wallets, tokens, and on-chain events.',
    },
    {
        icon: Eye,
        title: 'Unlimited Watchlist',
        description: 'Track as many wallets and tokens as you want, without any limitations on the Pro plan.',
    },
     {
        icon: Wallet,
        title: 'Wallet Intelligence',
        description: 'Dive deep into any wallet to see their holdings, transaction history, and performance.',
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
      '5 Quick Alerts',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Unlimited access to every tool for the serious on-chain analyst.',
    priceMonthly: '$7',
    priceYearly: '$6',
    features: [
      'Unlimited Watchlist Items',
      'Unlimited Quick & Advanced Alerts',
      'Detailed Wallet Analytics',
    ],
  },
};


export const features = [
  {
    category: 'Core Features',
    items: [
      { name: 'Real-Time Whale Feed', free: true, pro: true },
      { name: 'Watchlist', free: '5 items', pro: 'Unlimited' },
    ],
  },
  {
    category: 'Alerts',
    items: [
      { name: 'Quick Alerts', free: '5 active', pro: 'Unlimited' },
      { name: 'Advanced Alert Builder', free: false, pro: true },
      { name: 'Telegram Notifications', free: false, pro: true },
    ],
  },
   {
    category: 'Analytics',
    items: [
        { name: 'Wallet Profile Details', free: true, pro: true },
        { name: 'Historical Performance Data', free: '7-day history', pro: 'Full history' },
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
  {
    question: 'How "real-time" is the data?',
    answer: 'Our Pro plan offers a feed with near-zero latency, pulling data directly as transactions are confirmed on-chain. The Free plan feed has a delay of up to 1-2 minutes.',
  },
   {
    question: 'Do you offer a free trial for the Pro plan?',
    answer: "We do not offer a time-based free trial. However, our Free plan is a great way to experience the core functionality of Track100x. You can upgrade to Pro at any time to unlock all features.",
  },
];
