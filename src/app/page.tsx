
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import React from 'react';
import { HomePageCta } from '@/components/home-page-cta';
import { FeatureHighlights } from '@/components/feature-highlights';

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
        <FeatureHighlights />

        {/* Leaderboard Preview */}
        <LeaderboardPreview />

        {/* Final CTA */}
        <HomePageCta />
      </div>
    </div>
  );
}
