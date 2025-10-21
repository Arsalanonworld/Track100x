
'use client';

import { Leaderboard } from '@/components/leaderboard';
import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <div className="flex-1 space-y-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                 </div>
            </div>
             <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Skeleton className="h-10 w-full flex-1" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-[73px] w-full" />
                ))}
            </div>
        </div>
    )
}

function LeaderboardPage() {
  return (
    <div>
      <PageHeader
          title="Smart Money Dashboard"
          description="Discover and track the most influential and profitable wallets in real-time."
      />
      <Leaderboard />
    </div>
  );
}

export default LeaderboardPage;
