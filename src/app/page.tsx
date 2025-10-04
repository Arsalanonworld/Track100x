
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import { BarChart, Bell, CheckCircle, Zap } from 'lucide-react';
import { TypewriterHero } from '@/components/typewriter-hero';
import { HomePageCta } from '@/components/home-page-cta';

const features = [
  {
    name: 'Live Whale Feed',
    icon: Zap,
  },
  {
    name: 'Wallet Leaderboards',
    icon: BarChart,
  },
  {
    name: 'Real-Time Alerts',
    icon: Bell,
  },
  {
    name: 'Free for Everyone',
    icon: CheckCircle,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-4 md:pt-16 md:pb-8">
        <TypewriterHero />
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          Stop guessing. Start tracking. Get real-time alerts on major whale
          transactions and decode on-chain data to make smarter trades.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {features.map((feature) => (
            <div key={feature.name} className="flex items-center gap-2">
              <feature.icon className="h-4 w-4 text-primary" />
              <span>{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Whale Feed Section */}
      <WhaleFeed />

      {/* CTA Section */}
      <HomePageCta />
    </div>
  );
}
