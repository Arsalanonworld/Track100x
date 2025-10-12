
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

export const StickyScrollFeatures = ({
  features,
}: {
  features: Feature[];
}) => {

  return (
     <section className="py-16 sm:py-24">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A New Standard in Wallet Analysis</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="relative group flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm h-full transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center h-full">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                          {React.cloneElement(feature.icon as React.ReactElement, { className: 'h-6 w-6 text-primary' })}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};
