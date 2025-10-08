
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
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: 'Unlimited Telegram Alerts',
        description: 'Create unlimited alerts and get notified instantly via Telegram to never miss a move.',
    },
    {
        icon: <Newspaper className="h-8 w-8 text-primary"/>,
        title: 'AI Insights & Daily Digest',
        description: 'Get AI-generated summaries and a daily digest of the most important whale movements and market signals.',
    },
     {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
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
            <h2 className="text-4xl font-bold mb-2">Your Market Edge is One Alert Away.</h2>
            <p className="text-muted-foreground text-lg mb-6">Create a custom alert now and never miss a critical market move again.</p>
            <Link href="/watchlist" passHref>
              <AnimatedButton size="lg">
                  Create a Free Alert
                  <ArrowRight className="ml-2" />
              </AnimatedButton>
            </Link>
        </div>
      </div>
    </div>
  );
}
