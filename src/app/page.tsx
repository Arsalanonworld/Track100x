
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { ArrowRight, Bell, Eye, Trophy, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/animated-button';
import { LeaderboardPreview } from '@/components/leaderboard-preview';
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const featureHighlights = [
    {
        icon: <Zap />,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: <Eye />,
        title: 'Unlimited Watchlist',
        description: 'Track as many wallets and tokens as you want, without any limitations.',
    },
    {
        icon: <Trophy />,
        title: 'Leaderboard Analytics',
        description: 'Discover and learn from the top-performing traders in real-time with our comprehensive leaderboard.',
    },
     {
        icon: <Wallet />,
        title: 'Full Portfolio Tracking',
        description: 'Link all your wallets and unlock complete historical data and performance insights.',
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
        <section className="py-16 sm:py-24">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A New Standard in Wallet Analysis</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
            </p>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl mx-auto">
              {featureHighlights.map((feature, index) => (
                <div key={index} className="group flex flex-col items-center text-center p-4 rounded-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                        {React.cloneElement(feature.icon as React.ReactElement, { className: 'h-8 w-8 text-primary' })}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                    <div className="w-1/4 h-px bg-border mt-6 group-hover:w-full group-hover:bg-primary transition-all duration-300"></div>
                </div>
              ))}
          </div>
        </section>

        {/* Leaderboard Preview */}
        <LeaderboardPreview />

        {/* Final CTA */}
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-2">From Data to Alpha. Your Edge is Here.</h2>
            <p className="text-muted-foreground text-lg mb-6">Start your on-chain research and discover the next big opportunity.</p>
            <Link href="/dashboard" passHref>
              <AnimatedButton size="lg">
                  Start for Free
                  <ArrowRight className="ml-2" />
              </AnimatedButton>
            </Link>
        </div>
      </div>
    </div>
  );
}
