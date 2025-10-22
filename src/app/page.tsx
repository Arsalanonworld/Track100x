
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import React from 'react';
import { HomePageCta } from '@/components/home-page-cta';
import { FeatureHighlights } from '@/components/feature-highlights';
import { PricingPreview } from '@/components/pricing-preview';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      {/* Hero Section */}
      <HeroSection />

      <div className="container space-y-12 md:space-y-20">
        {/* Whale Feed Section */}
        <section id="whale-feed">
          <WhaleFeed isPreview={true} showTitle={true} />
        </section>
        
        {/* Feature Highlights Section */}
        <FeatureHighlights />

        {/* Leaderboard Preview (Full Width) */}
        <LeaderboardPreview />
      </div>

      <div className="container space-y-12 md:space-y-20">
        {/* Pricing Section */}
        <section id="pricing">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Clear Pricing</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your strategy. Start for free, upgrade when you're ready.
            </p>
          </div>
          <PricingPreview />
        </section>

        {/* Final CTA */}
        <HomePageCta />
      </div>
    </div>
  );
}
