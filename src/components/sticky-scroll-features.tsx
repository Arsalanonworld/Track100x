
'use client';

import React, { useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlaceHolderImagesById } from '@/lib/placeholder-images';
import Image from 'next/image';

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
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = features.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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

  const backgroundColors = [
    "var(--zinc-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];

  const FeatureCard = ({ slug }: { slug: string }) => {
    const image = PlaceHolderImagesById[slug];
    if (!image) return null;
    return (
        <div className="relative h-full w-full rounded-2xl overflow-hidden">
            <Image 
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-black/40"></div>
      </div>
    );
  };

  return (
     <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">A New Standard in Wallet Analysis</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
        </p>
        <motion.div
            className="h-[30rem] overflow-y-auto flex justify-center relative rounded-2xl p-4 sm:p-10 mt-10 bg-card border"
            ref={ref}
            >
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="font-bold text-foreground text-2xl mb-4 text-left">
                        {features[activeCard].title}
                    </div>
                    <div className="text-muted-foreground max-w-lg text-left">
                        {features.map((item, index) => (
                        <motion.div
                            key={item.title + index}
                            animate={{
                                opacity: activeCard === index ? 1 : 0.3,
                            }}
                            className="my-20"
                        >
                            <h2 className="text-xl font-bold">{item.title}</h2>
                            <p className="text-base mt-2">{item.description}</p>
                        </motion.div>
                        ))}
                    </div>
                </div>
            </div>
             <motion.div
                className={cn(
                    'hidden lg:block h-80 w-[45rem] rounded-xl bg-background sticky top-10 overflow-hidden'
                )}
            >
                {features[activeCard] && <FeatureCard slug={features[activeCard].contentSlug} />}
            </motion.div>
        </motion.div>
    </div>
  );
};

