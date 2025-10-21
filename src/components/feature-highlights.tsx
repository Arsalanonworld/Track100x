
'use client';

import React from 'react';
import { featureHighlights } from '@/lib/app-data';
import { RotatingCryptoCircle } from './rotating-crypto-circle';

export function FeatureHighlights() {
    return (
        <section id="features" className="py-16 sm:py-24">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A New Standard in Wallet Analysis</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
            </p>
          </div>
          <RotatingCryptoCircle />
        </section>
    );
}
