
'use client';

import React from 'react';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';
import { Skeleton } from '@/components/ui/skeleton';

function DefaultPageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[73px] rounded-lg border">
                        <Skeleton className="h-full w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

type WithAuthOptions = {
    skeleton?: React.ComponentType;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthComponent = (props: P) => {
    const { user, loading } = useUser();
    const SkeletonComponent = options.skeleton || DefaultPageSkeleton;

    if (loading) {
      return <SkeletonComponent />;
    }

    if (!user) {
      return (
        <div className="relative h-[calc(100vh-200px)]">
            <FeatureLock />
            <div className='invisible'>
                <SkeletonComponent />
            </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
}
