'use client';
import { ArrowRight } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';
import Link from 'next/link';

export const HomePageCta = () => {

    return (
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold font-headline mb-2">Your Market Edge is One Alert Away.</h2>
            <p className="text-muted-foreground text-lg mb-6">Create a custom alert now and never miss a critical market move again.</p>
            <Link href="/alerts" passHref>
              <AnimatedButton size="lg">
                  Create a Free Alert
                  <ArrowRight className="ml-2" />
              </AnimatedButton>
            </Link>
        </div>
    );
};
