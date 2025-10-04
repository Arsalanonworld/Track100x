
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import { Button } from '@/components/ui/button';
import { ArrowDown, Zap } from 'lucide-react';
import HeroSection from '@/components/hero-section';
import { HomePageCta } from '@/components/home-page-cta';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import Link from 'next/link';
import HeroStats from '@/components/hero-stats';

export default function HomePage() {
  const scrollToFeed = () => {
    document.getElementById('whale-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 md:space-y-24 -mt-8">
      {/* Hero Section */}
      <HeroSection />
      <HeroStats />

      <div className="container space-y-16 md:space-y-24">
        <div className="text-center">
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
    </div>
  );
}
