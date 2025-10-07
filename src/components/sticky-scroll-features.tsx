
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
     <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">A New Standard in Wallet Analysis</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
        </p>
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-4xl mx-auto mt-10"
        >
            <CarouselContent>
                {features.map((feature, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                           <Card className="flex flex-col items-center text-center p-6 h-full">
                                <CardHeader className="p-0">
                                    {feature.icon}
                                    <h3 className="text-lg font-bold mt-4 mb-2">{feature.title}</h3>
                                </CardHeader>
                                <CardContent className="p-0 flex-1">
                                     <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </CardContent>
                           </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
  );
};

    