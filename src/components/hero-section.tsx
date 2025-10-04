
'use client';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bell, CheckCircle } from "lucide-react";
import { WhaleIcon } from "./icons/whale-icon";

const phrases = [
    'Follow the Smart Money.',
    'Decode On-Chain Data.',
    'Anticipate Market Moves.',
    'Unlock Crypto Alpha.',
    'Track Whale Wallets.',
    'Real-Time Crypto Alerts.',
    'Your On-Chain Edge.',
    'See Transactions Happen Live.',
    'Monitor Top Trader Wallets.',
    'Never Miss a Big Move.',
    'The Ultimate Wallet Intel.',
    'Data-Driven Crypto Trading.',
    'Find Narratives Before They Trend.',
    'Copy-Trade the Pros.',
    'Follow the On-Chain Flow.',
    'From Noise to Signal.',
    'Master On-Chain Analysis.',
    'Get Notified, Act Faster.',
    'Your Window into Crypto Whales.',
    'Trade with Confidence.',
];

const features = [
    {
        icon: <WhaleIcon className="h-5 w-5 text-muted-foreground" />,
        label: "Live Whale Feed"
    },
    {
        icon: <BarChart className="h-5 w-5 text-muted-foreground" />,
        label: "Wallet Leaderboards"
    },
    {
        icon: <Bell className="h-5 w-5 text-muted-foreground" />,
        label: "Real-Time Alerts"
    },
    {
        icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
        label: "Free for Everyone"
    }
];

export default function HeroSection() {
    const [text, setText] = useState('');
    const phraseIndex = useRef(0);
    const isDeleting = useRef(false);
    const lastUpdateTime = useRef(0);
    const frameId = useRef<number>();

    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayAfterTyping = 2000;
    const [pauseTime, setPauseTime] = useState<number | null>(null);

    useEffect(() => {
        const handleTyping = (currentTime: number) => {
            if (!lastUpdateTime.current) {
                lastUpdateTime.current = currentTime;
            }

            const deltaTime = currentTime - lastUpdateTime.current;
            const currentPhrase = phrases[phraseIndex.current];
            
            if (pauseTime && currentTime < pauseTime) {
                frameId.current = requestAnimationFrame(handleTyping);
                return;
            }
            setPauseTime(null);

            const speed = isDeleting.current ? deletingSpeed : typingSpeed;

            if (deltaTime > speed) {
                lastUpdateTime.current = currentTime;
                
                if (isDeleting.current) {
                    if (text.length > 0) {
                        setText(current => current.substring(0, current.length - 1));
                    } else {
                        isDeleting.current = false;
                        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
                    }
                } else {
                    if (text.length < currentPhrase.length) {
                        setText(current => currentPhrase.substring(0, current.length + 1));
                    } else {
                        setPauseTime(currentTime + delayAfterTyping);
                        isDeleting.current = true;
                    }
                }
            }
            
            frameId.current = requestAnimationFrame(handleTyping);
        };
        
        frameId.current = requestAnimationFrame(handleTyping);
        
        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, [text]); // Only re-trigger when text state changes

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-card to-background flex flex-col items-center justify-center min-h-[280px] py-12 md:min-h-[320px]">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] dark:opacity-20"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h1 className="relative text-3xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground inline-block h-16 sm:h-20 flex items-center justify-center">
                    <span>{text}</span>
                    <span className="absolute -right-2 top-0 bottom-0 w-1.5 bg-primary animate-blinking-cursor"></span>
                </h1>
                 <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
                    The ultimate wallet intelligence platform. Track whale transactions and get real-time smart alerts.
                </p>
                 <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8">
                    {features.map((feature) => (
                       <div key={feature.label} className="flex items-center gap-3">
                            {feature.icon}
                            <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
                       </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
