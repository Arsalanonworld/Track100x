
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { HomePageCta } from '@/components/home-page-cta';
import { LeaderboardPreview } from '@/components/leaderboard-preview';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16 lg:-mt-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Whale Feed Section - Full width on mobile */}
      <div id="whale-feed">
          <WhaleFeed />
      </div>

      {/* Other sections with container for padding */}
      <div className="container">
          <div className="space-y-12 md:space-y-16">
            <LeaderboardPreview />
            <HomePageCta />
          </div>
      </div>
    </div>
  );
}
