
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { HomePageCta } from '@/components/home-page-cta';

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-12 lg:-mt-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Whale Feed Section & Other sections */}
      <div className="container">
        <div id="whale-feed">
          <WhaleFeed isPreview={true} />
        </div>
        <HomePageCta />
      </div>
    </div>
  );
}
