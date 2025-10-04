'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <div className="text-center pt-16 pb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-4">
              Don't Follow the News. <br/> Follow the Money.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              Stop reacting to old news. Track100x Pro gives you the real-time on-chain data and advanced tools you need to anticipate market moves before they happen.
            </p>
            <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/upgrade">
                        Upgrade to Pro Now
                        <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </div>
        </div>

        {/* Social Proof Section */}
        <div className="text-center">
            <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-6">
                Trusted by top traders & analysts
            </h2>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground"/>
                    <span className="font-semibold text-muted-foreground">CRYPTO FUND</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <Brain className="h-8 w-8 text-muted-foreground"/>
                    <span className="font-semibold text-muted-foreground">DEGEN TRADERS</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <Trophy className="h-8 w-8 text-muted-foreground"/>
                    <span className="font-semibold text-muted-foreground">ALPHA HUNTERS</span>
                </div>
            </div>
        </div>
        
        {/* Placeholder for "An Unfair Advantage is Waiting" */}
        <div className="text-center py-20">
          <h2 className="text-4xl font-bold font-headline">An Unfair Advantage is Waiting</h2>
          {/* Content for this section will be added later */}
        </div>

    </div>
  );
}
