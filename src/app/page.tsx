
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { StickyScrollFeatures } from '@/components/sticky-scroll-features';
import { ArrowRight, Bell, Newspaper, ShieldCheck, Zap } from 'lucide-react';
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
        icon: <Bell />,
        title: 'Unlimited Telegram Alerts',
        description: 'Create unlimited alerts and get notified instantly via Telegram to never miss a move.',
    },
    {
        icon: <Newspaper />,
        title: 'AI Insights & Daily Digest',
        description: 'Get AI-generated summaries and a daily digest of the most important whale movements and market signals.',
    },
     {
        icon: <ShieldCheck />,
        title: 'Ad-Free Experience',
        description: 'Enjoy a clean, uninterrupted interface focused solely on the data and insights that matter.',
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
