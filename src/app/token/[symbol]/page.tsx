'use client';

import { withAuth } from '@/components/auth/withAuth';
import { ComingSoon } from '@/components/coming-soon';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
             <Skeleton className="h-96 w-full" />
        </div>
    )
}


function TokenPage({ params }: { params: { symbol: string } }) {
    const featureName = `Token Analytics: ${params.symbol.toUpperCase()}`;
    return <ComingSoon featureName={featureName} />;
}

export default withAuth(TokenPage, { skeleton: PageSkeleton, proOnly: true });
