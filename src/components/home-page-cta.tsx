
'use client';
import { ArrowRight } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';
import Link from 'next/link';

export const HomePageCta = () => {

    return (
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-2">From Data to Alpha. Your Edge is Here.</h2>
            <p className="text-muted-foreground text-lg mb-6">Start your on-chain research and discover the next big opportunity.</p>
            <Link href="/watchlist" passHref>
              <AnimatedButton size="lg">
                  Start for Free
                  <ArrowRight className="ml-2" />
              </AnimatedButton>
            </Link>
        </div>
    );
};
