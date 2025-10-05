
'use client';

import { LogoIcon } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowRight, Bot, GitCompareArrows, LineChart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const futureFeatures = [
    {
        icon: <Bot className="h-6 w-6 text-primary" />,
        title: 'AI-Generated Insights',
        description: 'Our AI will analyze whale movements and automatically generate actionable trading signals and market narratives for you.'
    },
    {
        icon: <LineChart className="h-6 w-6 text-primary" />,
        title: 'Portfolio Simulation',
        description: 'Backtest your strategies. See how your portfolio would have performed if you had copied the moves of top wallets.'
    },
    {
        icon: <GitCompareArrows className="h-6 w-6 text-primary" />,
        title: 'Cross-Chain Social Feed',
        description: 'A unified feed to see what the crypto community is saying about specific transactions, wallets, and tokens across all social platforms.'
    },
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: 'Gamified Trading Leagues',
        description: 'Compete with other users in paper trading leagues based on real-time on-chain data. Climb the ranks and prove your skills.'
    }
]

const calculateTimeLeft = () => {
    const difference = +new Date("2025-01-01") - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return timeLeft;
};


export default function ComingSoonPage() {

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)] dark:opacity-20"></div>
      
      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        
        <header className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <a href="/" className="inline-flex items-center gap-2">
            <LogoIcon />
            <span className="text-xl font-bold">Track100x</span>
          </a>
        </header>

        <main className="w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            The Future of On-Chain Intelligence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            We are building the most advanced platform for tracking smart money in crypto. Get ready for AI-powered insights, portfolio simulation, and powerful new tools to give you an edge.
          </p>

          <section id="countdown" className="my-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="rounded-lg bg-card/80 backdrop-blur-sm border p-4">
                        <div className="text-4xl font-bold text-primary">{String(value).padStart(2, '0')}</div>
                        <div className="text-sm uppercase text-muted-foreground">{unit}</div>
                    </div>
                ))}
            </div>
          </section>

          <section id="features" className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left animate-fade-in-up" style={{ animationDelay: '1s' }}>
              {futureFeatures.map((feature, i) => (
                  <div key={i} className="rounded-xl border bg-card/50 p-6 flex items-start gap-4">
                      <div className="flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                  </div>
              ))}
          </section>

          <section id="signup" className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <h2 className="text-xl font-semibold">Be the first to know.</h2>
            <p className="text-muted-foreground mt-2 mb-6">Join our mailing list to get notified when we launch.</p>
            <form className="mx-auto flex max-w-md gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" required />
              <Button type="submit">
                Notify Me <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </form>
          </section>
        </main>
        
        <footer className="mt-12 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <p>&copy; {new Date().getFullYear()} Track100x. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
