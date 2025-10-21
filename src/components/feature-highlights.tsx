
'use client';

import React from 'react';
import { featureHighlights } from '@/lib/app-data';
import { CryptoFeatureWeb } from './rotating-crypto-circle';

export function FeatureHighlights() {
    return (
        <section id="features" className="py-16 sm:py-24">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Illuminate the On-Chain Universe</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform transforms the chaos of on-chain data into a clear map of opportunities, revealing the connections and strategies that drive the market.
            </p>
          </div>
          <CryptoFeatureWeb />
        </section>
    );
}
