
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
                Each feature is designed to work together, giving you a complete view of the on-chain landscape.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {featureHighlights.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className="text-center">
                         <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                           <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                )
            })}
          </div>

          <CryptoFeatureWeb />
        </section>
    );
}
