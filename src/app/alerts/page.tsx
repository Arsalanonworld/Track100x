
'use client';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import AlertCreatorCard from '@/components/alerts/alert-creator-card';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/page-header';
import { useAuthDialog } from '@/hooks/use-auth-dialog';

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();


  if (isUserLoading) {
    return (
        <>
            <div className="space-y-2 mb-8">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-6 w-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-[700px] w-full" />
                </div>
                <div className="lg:col-span-3 space-y-8">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </>
    );
  }

  const showLoginWall = !user;

  return (
      <div className="space-y-8">
           <PageHeader
            title="Alerts"
            description="Track whales, wallets, and tokens in real-time. Never miss a big move."
           />

          <div className="relative">
              <div className={cn(showLoginWall && "blur-sm pointer-events-none")}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                      <div className="lg:col-span-2 space-y-8">
                        <AlertCreatorCard />
                      </div>
                      <div className="lg:col-span-3 space-y-8">
                        <ActiveAlerts />
                        <AlertHistory />
                      </div>
                  </div>
              </div>

              {showLoginWall && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                     <div className="text-center p-8 rounded-lg bg-background/80">
                         <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                         <h3 className="text-xl font-bold font-headline">Log In to Create Alerts</h3>
                         <p className="text-muted-foreground mb-4 max-w-sm">
                            Create a free account to set up real-time notifications for your favorite wallets and tokens.
                         </p>
                         <Button size="lg" onClick={() => setAuthDialogOpen(true)}>
                             Log In / Sign Up
                         </Button>
                     </div>
                 </div>
              )}
          </div>
      </div>
  );
}
