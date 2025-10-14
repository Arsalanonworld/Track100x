
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
    return (
        <Card className="flex items-center p-6">
            <div className="mr-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-muted-foreground mt-1">{description}</p>
            </div>
        </Card>
    );
  }
  
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-card border-2 border-dashed relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        <div className="relative z-10 flex items-center">
            <div className="mr-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-muted-foreground mt-1 max-w-xs">{description}</p>
            </div>
        </div>
         <Button asChild size="sm" className="mt-4 sm:mt-0 shrink-0">
            <Link href="/upgrade">
                <Lock className="mr-2 h-4 w-4" />
                Upgrade to Pro
            </Link>
        </Button>
    </Card>
  );
}
