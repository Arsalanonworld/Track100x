
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import { Button } from '@/components/ui/button';
import { ArrowDown, Zap } from 'lucide-react';
import { TypewriterHero } from '@/components/typewriter-hero';
import { HomePageCta } from '@/components/home-page-cta';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import Link from 'next/link';

export default function HomePage() {
  const scrollToFeed = () => {
    document.getElementById('whale-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-4 md:pt-16 md:pb-8">
        <TypewriterHero />
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          Stop guessing. Start tracking. Get real-time alerts on major whale
          transactions and decode on-chain data to make smarter trades.
        </p>
        <div className="flex justify-center items-center gap-4">
          <Button size="lg" onClick={scrollToFeed}>
            <ArrowDown />
            Explore Whale Feed
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/alerts">
              <Zap className="text-primary" />
              Set Alerts
            </Link>
          </Button>
        </div>
      </div>

      {/* Whale Feed Section */}
      <div id="whale-feed">
        <WhaleFeed />
      </div>

      {/* Leaderboard Preview Section */}
      <LeaderboardPreview />

      {/* CTA Section */}
      <HomePageCta />
    </div>
  );
}
