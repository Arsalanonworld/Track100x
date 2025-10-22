
'use client';

import React from 'react';
import { featureHighlights } from '@/lib/app-data';
import { CryptoFeatureWeb } from './rotating-crypto-circle';

export function FeatureHighlights() {
    return (
        <section id="features" className="py-16 sm:py-20">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A Powerful, Interconnected Toolset</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Each feature is designed to work together, giving you a complete view of the on-chain landscape from whale movements to wallet leaderboards.
            </p>
          </div>
          <CryptoFeatureWeb />
        </section>
    );
}
