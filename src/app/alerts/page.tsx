
'use client';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import AlertCreatorCard from '@/components/alerts/alert-creator-card';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/page-header';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ProFeatureLock } from '@/components/pro-feature-lock';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isLoading = isUserLoading || isUserDataLoading;
  const isPro = userData?.plan === 'pro';

  if (isLoading) {
    return (
        <>
            <PageHeader
              title="Alerts"
              description="Track whales, wallets, and tokens in real-time. Never miss a big move."
            />
            <div className="flex justify-center items-center h-[calc(100vh-400px)]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </>
    );
  }

  const showLoginWall = !user;
  const showUpgradeWall = user && !isPro;

  return (
      <div className="space-y-8">
           <PageHeader
            title="Alerts"
            description="Track whales, wallets, and tokens in real-time. Never miss a big move."
           />

          <div className="relative">
              <div className={cn((showLoginWall || showUpgradeWall) && "blur-sm pointer-events-none")}>
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
                 <ProFeatureLock
                    title="Log In to Create Alerts"
                    description="Create a free account to set up real-time notifications for your favorite wallets and tokens."
                    buttonText="Log In / Sign Up"
                    onButtonClick={() => setAuthDialogOpen(true)}
                  />
              )}
               {showUpgradeWall && (
                 <ProFeatureLock
                    title="Unlock Unlimited Alerts & Advanced Features"
                    description="Upgrade to Pro for unlimited alerts, multi-condition rules with the Advanced Builder, and instant Telegram/Discord notifications."
                  />
              )}
          </div>
      </div>
  );
}
