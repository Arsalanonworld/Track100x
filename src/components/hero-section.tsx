
'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, Eye, Search, Wallet } from "lucide-react";
import { WhaleIcon } from "./icons/whale-icon";
import React from 'react';

const phrases = [
    'Decode On-Chain Behavior.',
    'Follow the Smart Money.',
    'Discover Alpha, Faster.',
    'Analyze Wallet Movements.',
    'Turn Data into Opportunity.',
    'The On-Chain Research Hub.',
    'Find Narratives Early.',
    'Master Crypto Intelligence.',
];

const features = [
    {
        icon: <Wallet />,
        label: "Wallet Intelligence"
    },
    {
        icon: <Search />,
        label: "Ecosystem Research"
    },
    {
        icon: <Bell />,
        label: "On-Chain Analytics"
    },
    {
        icon: <WhaleIcon />,
        label: "Real-Time Whale Flow"
    },
];

export default function HeroSection() {
    const [text, setText] = useState('');
    const phraseIndex = useRef(0);
    const isDeleting = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const typingSpeed = 200;
    const deletingSpeed = 100;
    const delayAfterTyping = 2000;

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex.current];
            
            if (isDeleting.current) {
                setText(current => current.substring(0, current.length - 1));
            } else {
                setText(current => currentPhrase.substring(0, current.length + 1));
            }

            const currentText = text;
            let delay = isDeleting.current ? deletingSpeed : typingSpeed;

            if (!isDeleting.current && currentText === currentPhrase) {
                delay = delayAfterTyping;
                isDeleting.current = true;
            } else if (isDeleting.current && currentText === '') {
                isDeleting.current = false;
                phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
                delay = typingSpeed;
            }

             timeoutRef.current = setTimeout(handleTyping, delay);
        };
        
        handleTyping();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);


    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-card to-background flex flex-col items-center justify-center min-h-[240px] py-12 md:min-h-[280px]">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] dark:opacity-20"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h1 className="relative text-3xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground inline-flex items-center justify-center min-h-[40px] sm:min-h-[64px] lg:min-h-[72px]">
                    <span>{text}</span>
                    <span className="animate-blinking-cursor w-1 sm:w-1.5 h-8 sm:h-12 ml-1 bg-primary"></span>
                </h1>
                 <p className="max-w-3xl mx-auto mt-4 text-base sm:text-lg text-muted-foreground">
                    The Blockchain Intelligence Platform for investors, traders, and researchers.
                </p>
                 <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {features.map((feature) => (
                       <div key={feature.label} className="flex items-center gap-2">
                            {React.cloneElement(feature.icon, { className: 'h-4 w-4' })}
                            <span>{feature.label}</span>
                       </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

