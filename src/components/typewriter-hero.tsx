'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const words = ['Decode On-Chain.', 'Track The Whales.', 'Find The Alpha.'];

export function TypewriterHero() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  // Typing effect
  useEffect(() => {
    if (index === words.length) {
      // Loop back to the beginning if you want a continuous loop
      // setIndex(0); 
      return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1000); // Pause before deleting
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, Math.random() * 350));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  // Cursor blinking effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4 h-24 md:h-32">
      {`${words[index].substring(0, subIndex)}`}
      <span
        className={cn(
          'border-l-4 border-primary',
          blink ? 'opacity-100' : 'opacity-0'
        )}
      />
    </h1>
  );
}
