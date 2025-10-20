'use client';

import PageHeader from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export function ComingSoon({ featureName }: { featureName: string }) {
    return (
        <div>
            <PageHeader 
                title={featureName}
                description="This feature is currently under development."
            />
            <Card className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed h-96">
                <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold">Coming Soon!</h2>
                <p className="text-muted-foreground mt-2">
                    Our team is hard at work building this feature. Check back later!
                </p>
            </Card>
        </div>
    )
}
