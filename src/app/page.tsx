
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { HomePageCta } from '@/components/home-page-cta';
import { LeaderboardPreview } from '@/components/leaderboard-preview';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16 -mt-8">
      {/* Hero Section */}
      <HeroSection />

      <div className="container space-y-12 md:space-y-16">
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
