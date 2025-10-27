
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingTokenCard } from '@/components/radar/trending-token-card';
import type { TrendingToken } from '@/lib/types';
import { trendingTokens as mockTokens } from '@/lib/mock-data';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='space-y-2'>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
        </div>
    )
}


export default function RadarPage() {
    const [tokens, setTokens] = useState<TrendingToken[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch data from an API like Birdeye or DexScreener
        setLoading(true);
        const timer = setTimeout(() => {
            setTokens(mockTokens);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <PageHeader
                title="Radar"
                description="Discover what’s trending across chains and tokens right now."
            />
            
            {loading ? (
                <PageSkeleton />
            ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tokens.map(token => (
                        <TrendingTokenCard key={token.id} token={token} />
                    ))}
                </div>
            )}
        </div>
    )
}
