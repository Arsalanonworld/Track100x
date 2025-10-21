
'use client';

import React from 'react';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';
import { Skeleton } from '../ui/skeleton';

type WithAuthOptions = {
    skeleton?: React.ComponentType;
    proOnly?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthComponent = (props: P) => {
    const { user, loading, claims } = useUser();
    const SkeletonComponent = options.skeleton;
    const isPro = claims?.plan === 'pro';

    if (loading) {
      if (SkeletonComponent) {
        return <SkeletonComponent />;
      }
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="relative min-h-[60vh]">
          <div aria-hidden="true" className="pointer-events-none blur-sm">
              {SkeletonComponent ? <SkeletonComponent /> : <Skeleton className="h-full w-full min-h-[60vh]" />}
          </div>
          <FeatureLock />
        </div>
      );
    }

    if (options.proOnly && !isPro) {
        return (
            <div className="relative min-h-[60vh]">
                <div aria-hidden="true" className="pointer-events-none blur-sm">
                    {SkeletonComponent ? <SkeletonComponent /> : <Skeleton className="h-full w-full min-h-[60vh]" />}
                </div>
                <FeatureLock proLock={true}/>
            </div>
        )
    }
    
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
}
