
'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type FeatureLockInlineProps = {
  title: string;
  description: string;
};

export function FeatureLockInline({ title, description }: FeatureLockInlineProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent flex flex-col items-center justify-center text-center p-8">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
            <Lock className="h-8 w-8 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1 mb-4">
                {description}
            </p>
            <Button asChild>
                <Link href="/upgrade">Upgrade to Pro</Link>
            </Button>
        </div>
    </div>
  );
}
