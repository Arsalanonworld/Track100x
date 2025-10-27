
import React from 'react';
import { Bell, Eye, Wallet, Zap, Rss, Radar } from 'lucide-react';


export const navItems = [
    {
      label: "Radar",
      icon: Radar,
      href: "/radar",
    },
    {
      label: "Watchlist",
      icon: Eye,
      href: "/watchlist",
    },
    {
      label: "Alerts",
      icon: Bell,
      href: "/alerts",
    },
];

export const featureHighlights = [
    {
        icon: Zap,
        title: 'Advanced & Quick Alerts',
        description: 'Get instant Telegram notifications for any on-chain event. Create simple alerts or build complex ones with our Pro builder.',
    },
    {
        icon: Eye,
        title: 'Unlimited Watchlist',
        description: 'Track every wallet and token that matters to you. Your on-chain universe, all in one place.',
    },
     {
        icon: Radar,
        title: 'Smart Money Radar',
        description: 'Discover trending tokens and see which wallets are making the most profitable moves right now.',
    },
];

export const pricing = {
  free: {
    name: 'Free',
    description: 'Get a feel for the market with our essential on-chain tools.',
    price: '$0',
    features: [
      'Real-Time Whale Feed (Delayed)',
      '5 Items on Watchlist',
      '5 Quick Alerts',
      '7-Day Historical Data',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'The ultimate toolkit for serious on-chain analysts and traders.',
    priceMonthly: '$7',
    priceYearly: '$6',
    features: [
      'Everything in Free, plus:',
      'Unlimited Watchlist Items',
      'Unlimited Quick & Advanced Alerts',
      'Smart Money Radar',
      'Telegram Notifications',
      'Full Historical Data',
      'Priority Support'
    ],
  },
};


export const features = [
  {
    category: 'Core Tools',
    items: [
      { name: 'Real-Time Whale Feed', free: 'Delayed', pro: 'Real-Time' },
      { name: 'Watchlist Capacity', free: '5 items', pro: 'Unlimited' },
      { name: 'Smart Money Radar', free: false, pro: true },
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
    category: 'Analytics & Data',
    items: [
        { name: 'Wallet Profile Details', free: true, pro: true },
        { name: 'Historical Performance Data', free: '7-day history', pro: 'Full history' },
        { name: 'Data Export (CSV)', free: false, pro: true },
    ]
   },
  {
    category: 'Support & Experience',
    items: [
      { name: 'Priority Support', free: false, pro: true },
      { name: 'Ad-Free Experience', free: false, pro: true },
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
