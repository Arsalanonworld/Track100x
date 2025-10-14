
'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type FeatureLockInlineProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked?: boolean; // Controls whether to show lock state or normal state
};

export function FeatureLockInline({ title, description, icon, isLocked = true }: FeatureLockInlineProps) {
  if (!isLocked) {
    // If the feature is not locked, you might want to render something else,
    // or nothing at all, depending on the use case.
    return null; 
  }
  
  return (
    <Card className="flex flex-col items-center justify-center text-center p-6 bg-card border-2 border-dashed relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        <div className="relative z-10">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-xs mx-auto">{description}</p>
            <Button asChild size="sm">
                <Link href="/upgrade">
                    <Lock className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                </Link>
            </Button>
        </div>
    </Card>
  );
}

    