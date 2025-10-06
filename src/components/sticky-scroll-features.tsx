
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import Image from 'next/image';
import { PlaceHolderImagesById } from '@/lib/placeholder-images';

type Feature = {
    title: string;
    description: string;
    contentSlug: string;
};

export const StickyScrollFeatures = ({
  features,
}: {
  features: Feature[];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ['start start', 'end start'],
  });
  const cardLength = features.length;

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const cardsBreakpoints = features.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = ['var(--zinc-900)', 'var(--black)', 'var(--neutral-900)'];
  const linearGradients = [
    'linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))',
    'linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))',
    'linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))',
    'linear-gradient(to bottom right, var(--blue-500), var(--purple-500))',
  ];

  const FeatureCard = ({ slug }: { slug: string }) => {
    const image = PlaceHolderImagesById[slug];
    if (!image) return null;
    return (
      <Card className="h-[30rem] w-full rounded-2xl p-8 bg-card flex flex-col justify-end">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image 
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
             <div className="absolute inset-0 bg-black/40"></div>
          </div>
      </Card>
    );
  };

  return (
     <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">A New Standard in Wallet Analysis</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
        </p>
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            className="h-[40rem] flex justify-center relative space-x-10 rounded-2xl p-4 sm:p-10"
            ref={ref}
            >
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl">
                {features.map((item, index) => (
                    <div key={item.title + index} className="my-20">
                    <motion.h2
                        initial={{
                        opacity: 0,
                        }}
                        animate={{
                        opacity: activeCard === index ? 1 : 0.3,
                        }}
                        className="text-2xl font-bold text-slate-100 text-left"
                    >
                        {item.title}
                    </motion.h2>
                    <motion.p
                        initial={{
                        opacity: 0,
                        }}
                        animate={{
                        opacity: activeCard === index ? 1 : 0.3,
                        }}
                        className="text-kg text-slate-300 max-w-sm mt-4 text-left"
                    >
                        {item.description}
                    </motion.p>
                    </div>
                ))}
                <div className="h-40" />
                </div>
            </div>
            <motion.div
                animate={{
                    background: linearGradients[activeCard % linearGradients.length],
                }}
                className={cn(
                'hidden lg:block h-fit sticky top-10 overflow-hidden w-[40rem] rounded-2xl'
                )}
            >
                <FeatureCard slug={features[activeCard].contentSlug} />
            </motion.div>
        </motion.div>
    </div>
  );
};
