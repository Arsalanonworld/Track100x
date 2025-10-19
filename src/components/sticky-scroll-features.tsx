
'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const StickyScrollFeatures = ({ features }: { features: Feature[] }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const cardLength = features.length;

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const cardsPerBreakpoint = 1;
    const breakpoints = Array.from(Array(cardLength + 1).keys()).map(
      i => i / cardLength
    );
    const nearestBreakpointIndex = breakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - breakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(Math.min(nearestBreakpointIndex, cardLength - 1));
  });

  const backgroundColors = ['var(--background)', 'var(--black)'];

  return (
    <motion.div
      ref={ref}
      className="relative flex justify-center space-x-10 rounded-md p-2 md:p-10"
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          <div className="sticky top-10 h-full w-full overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl z-0" />
            <Card className="relative z-10 h-full w-full overflow-hidden rounded-2xl bg-background p-8 text-foreground shadow-2xl">
              <div className="flex h-full w-full items-center justify-center">
                <motion.div
                  key={features[activeCard]?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-center"
                >
                  <div className="mx-auto flex w-20 h-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                    {React.cloneElement(features[activeCard]!.icon as React.ReactElement, { className: 'h-10 w-10 text-primary' })}
                  </div>
                  <h3 className="text-3xl font-bold">
                    {features[activeCard]?.title}
                  </h3>
                </motion.div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8 py-20 lg:w-1/2">
        {features.map((item, index) => (
          <div
            key={item.title + index}
            className="my-20"
          >
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: activeCard === index ? 1 : 0.5,
              }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
              <p className="text-lg text-muted-foreground">{item.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
