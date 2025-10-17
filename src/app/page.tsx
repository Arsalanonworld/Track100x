
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { StickyScrollFeatures } from '@/components/sticky-scroll-features';
import { ArrowRight, Bell, Eye, Trophy, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/animated-button';
import { LeaderboardPreview } from '@/components/leaderboard-preview';

const featureHighlights = [
    {
        icon: <Zap />,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: <Eye />,
        title: 'Unlimited Watchlist',
        description: 'Track as many wallets and tokens as you want, without any limitations.',
    },
    {
        icon: <Trophy />,
        title: 'Leaderboard Analytics',
        description: 'Discover and learn from the top-performing traders in real-time with our comprehensive leaderboard.',
    },
     {
        icon: <Wallet />,
        title: 'Full Portfolio Tracking',
        description: 'Link all your wallets and unlock complete historical data and performance insights.',
    },
];

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-12 lg:-mt-8">
      {/* Hero Section */}
      <HeroSection />

      <div className="container">
        {/* Whale Feed Section */}
        <div id="whale-feed">
          <WhaleFeed isPreview={true} />
        </div>
        
        {/* Feature Highlights Section */}
        <StickyScrollFeatures features={featureHighlights} />

        {/* Leaderboard Preview */}
        <LeaderboardPreview />

        {/* Final CTA */}
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-2">From Data to Alpha. Your Edge is Here.</h2>
            <p className="text-muted-foreground text-lg mb-6">Start your on-chain research and discover the next big opportunity.</p>
            <Link href="/watchlist" passHref>
              <AnimatedButton size="lg">
                  Start for Free
                  <ArrowRight className="ml-2" />
              </AnimatedButton>
            </Link>
        </div>
      </div>
    </div>
  );
}
