
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/page-header';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
            <Skeleton className="h-[600px] w-full" />
        </div>
    )
}


function FeedPage() {
  return (
    <div>
        <PageHeader 
            title="Whale Feed"
            description="A live stream of significant on-chain transactions."
            className='hidden sm:block'
        />
        <WhaleFeed showTitle={false} />
    </div>
  );
}

export default FeedPage;
