
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
            <Card key={index} className="flex flex-col items-center text-center p-6">
                <CardHeader className="p-0">
                    {feature.icon}
                    <h3 className="text-lg font-bold mt-4 mb-2">{feature.title}</h3>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
            </Card>
            ))}
        </div>
    </section>
  );
};
    