'use client';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import AlertCreator from '@/components/alerts/alert-creator';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import PageHeader from '@/components/page-header';

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2 mb-8">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-6 w-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-96 w-full" />
                </div>
                <div className="lg:col-span-3 space-y-8">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return (
      <div className="space-y-8">
          <PageHeader
            title="Your Alerts"
            description="Track whales, wallets, and tokens in real-time. Never miss a big move."
           />

          <div className="relative">
              <div className={cn(!user && "blur-sm pointer-events-none")}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                      <div className="lg:col-span-2 space-y-8">
                        <AlertCreator />
                      </div>
                      <div className="lg:col-span-3 space-y-8">
                        <ActiveAlerts />
                        <AlertHistory />
                      </div>
                  </div>
              </div>

              {!user && !isUserLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                     <div className="text-center p-8 rounded-lg bg-background/80">
                         <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                         <h3 className="text-xl font-bold font-headline">Log In to Create Alerts</h3>
                         <p className="text-muted-foreground mb-4 max-w-sm">
                            Create a free account to set up real-time notifications for your favorite wallets and tokens.
                         </p>
                         <Button size="lg" asChild>
                             <Link href="/auth/login?next=/alerts">Log In / Sign Up</Link>
                         </Button>
                     </div>
                 </div>
              )}
          </div>
      </div>
  );
}
