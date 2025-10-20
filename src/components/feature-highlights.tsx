
'use client';

import React from 'react';
import { featureHighlights } from '@/lib/app-data';

export function FeatureHighlights() {
    return (
        <section className="py-16 sm:py-24">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A New Standard in Wallet Analysis</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
            </p>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl mx-auto">
              {featureHighlights.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="group flex flex-col items-center text-center p-4 rounded-lg transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                          <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                      <div className="w-1/4 h-px bg-border mt-6 group-hover:w-full group-hover:bg-primary transition-all duration-300"></div>
                  </div>
                );
              })}
          </div>
        </section>
    );
}
