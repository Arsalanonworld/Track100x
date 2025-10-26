
'use client';
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Eye, Search, Wallet } from "lucide-react";
import React, { useEffect, useState } from 'react';

const phrases = [
    'Follow the Smart Money.',
    'Track Whale Wallets.',
    'Discover Top Traders.',
    'Monitor On-Chain Activity.',
    'Find Alpha, Faster.',
    'Your On-Chain Command Center.',
];

const features = [
    {
        icon: <Wallet />,
        label: "Wallet Tracking"
    },
    {
        icon: <Search />,
        label: "Leaderboards"
    },
    {
        icon: <Bell />,
        label: "Real-Time Alerts"
    },
    {
        icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
            <path d="M17.28 9.22a4 4 0 0 0-5.76 5.56" />
            <path d="M16 11.37a4 4 0 0 1-5.5-5.5" />
            <path d="M4 14a1 1 0 0 0-1 1v3.83a1 1 0 0 0 .26.67l1.43 1.43c.2.2.45.3.7.3H18.3a1 1 0 0 0 .7-.3l1.43-1.43a1 1 0 0 0 .26-.67V15a1 1 0 0 0-1-1" />
            <path d="M4.27 14.27C2.43 12.43 2.5 9.5 4.5 7.5s5-2 7 .5" />
            <path d="m10 17 3.5-3.5" />
            <path d="M18.5 21a2.5 2.5 0 0 1-4.82-1.4" />
            <path d="M15 15.5a1.5 1.5 0 0 1-3 0" />
            </svg>,
        label: "Live Whale Feed"
    },
];

const SlidingText = ({ phrases }: { phrases: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <AnimatePresence mode="wait">
      <motion.h1
        key={phrases[index]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative text-3xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground text-center"
      >
        {phrases[index]}
      </motion.h1>
    </AnimatePresence>
  );
};


export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-card to-background flex flex-col items-center justify-center py-12">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] dark:opacity-20"></div>
            <div className="container mx-auto px-4 text-center relative">
                 <div className="min-h-[40px] sm:min-h-[64px] lg:min-h-[72px] flex items-center justify-center">
                    <SlidingText phrases={phrases} />
                 </div>
                 <p className="max-w-3xl mx-auto mt-4 text-base sm:text-lg text-muted-foreground">
                    The Blockchain Intelligence Platform for investors, traders, and researchers.
                </p>
                 <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {features.map((feature) => (
                       <div key={feature.label} className="flex items-center gap-2">
                            {React.cloneElement(feature.icon as React.ReactElement, { className: 'h-4 w-4' })}
                            <span>{feature.label}</span>
                       </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
