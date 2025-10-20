
'use client';

import { Leaderboard } from '@/components/leaderboard';
import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 h-[73px] rounded-lg border">
                         <Skeleton className="h-6 w-8" />
                         <Skeleton className="h-6 w-32 ml-4" />
                         <Skeleton className="h-6 w-24 ml-12" />
                         <Skeleton className="h-6 w-32 ml-12" />
                         <Skeleton className="h-6 w-24 ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
          title="Smart Money Dashboard"
          description="Discover and track the most influential and profitable wallets in real-time."
      />
      <Leaderboard />
    </div>
  );
}

export default LeaderboardPage;
