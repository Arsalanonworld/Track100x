
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
                <div key={index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                     <Card className="relative flex flex-col items-center text-center p-6 bg-card/95 h-full">
                        <CardHeader className="p-0 items-center">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                {React.cloneElement(feature.icon as React.ReactElement, { className: 'h-6 w-6 text-primary' })}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    </section>
  );
};
    