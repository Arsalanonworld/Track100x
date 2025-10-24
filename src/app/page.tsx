
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import React from 'react';
import { HomePageCta } from '@/components/home-page-cta';
import { FeatureHighlights } from '@/components/feature-highlights';
import { PricingPreview } from '@/components/pricing-preview';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Hero Section */}
      <HeroSection />

      <div className="container space-y-8 md:space-y-10">
        {/* Whale Feed Section */}
        <section id="whale-feed">
          <WhaleFeed isPreview={true} showTitle={true} />
        </section>
        
        {/* Feature Highlights Section */}
        <FeatureHighlights />
      </div>

      <div className="container space-y-8 md:space-y-12">
        {/* Pricing Section */}
        <section id="pricing">
           <div className="text-center mb-10">
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
