'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface ProFeatureLockProps {
    title: string;
    description: string;
}

export const ProFeatureLock = ({ title, description }: ProFeatureLockProps) => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-8 text-center rounded-lg">
            <Lock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
                {description}
            </p>
            <Button asChild>
                <Link href="/upgrade">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                </Link>
            </Button>
        </div>
    )
}
