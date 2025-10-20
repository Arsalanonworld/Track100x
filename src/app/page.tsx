
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import React from 'react';
import { HomePageCta } from '@/components/home-page-cta';
import { FeatureHighlights } from '@/components/feature-highlights';
import { PricingPreview } from '@/components/pricing-preview';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/watchlist');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24">
           <div className="text-center mb-16">
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
