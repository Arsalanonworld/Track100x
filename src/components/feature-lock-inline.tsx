
'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FeatureLockInlineProps = {
  title: string;
  description: string;
};

export function FeatureLockInline({ title, description }: FeatureLockInlineProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex h-64 flex-col items-center justify-end bg-gradient-to-t from-background via-background/90 to-transparent pb-8 text-center backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-border/50" />
        <Lock className="h-8 w-8 text-primary" />
        <h3 className="mt-4 text-xl font-bold">{title}</h3>
        <p className="mt-1 text-muted-foreground text-sm max-w-xs mx-auto">
            {description}
        </p>
        <Button asChild className="mt-4">
            <Link href="/upgrade">Upgrade to Pro</Link>
        </Button>
    </div>
  );
}
