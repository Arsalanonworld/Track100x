
'use client';

import { Megaphone } from 'lucide-react';

export function AdBanner() {
    return (
        <div className="flex items-center justify-center h-24 w-full rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
            <div className='text-center'>
                <Megaphone className="h-6 w-6 mx-auto mb-1" />
                <p className='text-sm font-medium'>Advertisement</p>
            </div>
        </div>
    )
}
