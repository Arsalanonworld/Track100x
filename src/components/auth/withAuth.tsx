'use client';

import React from 'react';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';

type WithAuthOptions = {
    skeleton?: React.ComponentType;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthComponent = (props: P) => {
    const { user, loading } = useUser();
    const SkeletonComponent = options.skeleton;

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
        <div className="relative">
            <FeatureLock />
            <div aria-hidden="true">
                {SkeletonComponent ? <SkeletonComponent /> : <div className='h-[calc(100vh-200px)]'></div>}
            </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
}
