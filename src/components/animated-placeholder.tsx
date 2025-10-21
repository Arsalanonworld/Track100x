
'use client';

import React, { useState, useEffect, useRef } from 'react';

const searchPlaceholders = [
  'Search for wallets...',
  'Search for tokens...',
  'e.g. 0xde0b...',
  'e.g. WIF, ETH, SOL',
  'Navigate to your portfolio...',
];

export function AnimatedPlaceholder() {
  const [placeholder, setPlaceholder] = useState(searchPlaceholders[0]);
  const placeholderIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = searchPlaceholders[placeholderIndex.current];
      
      let newText;
      if (isDeleting.current) {
        newText = placeholder.substring(0, placeholder.length - 1);
      } else {
        newText = currentPhrase.substring(0, placeholder.length + 1);
      }
      setPlaceholder(newText);
      
      let delay = isDeleting.current ? 50 : 100;

      if (!isDeleting.current && newText === currentPhrase) {
        delay = 2000; // Pause at the end of the phrase
        isDeleting.current = true;
      } else if (isDeleting.current && newText === '') {
        isDeleting.current = false;
        placeholderIndex.current = (placeholderIndex.current + 1) % searchPlaceholders.length;
        delay = 500; // Pause before typing new phrase
      }
      
      timeoutRef.current = setTimeout(handleTyping, delay);
    };

    timeoutRef.current = setTimeout(handleTyping, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [placeholder]);

  return (
    <>
      {placeholder}
      <span className="animate-blinking-cursor w-px h-4 ml-0.5 bg-foreground inline-block" />
    </>
  );
}
