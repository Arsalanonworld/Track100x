
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
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const alertsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/alerts`);
  }, [user, firestore]);
  const { data: alerts, isLoading: areAlertsLoading } = useCollection(alertsRef);

  const isLoading = isUserLoading || isUserDataLoading || areAlertsLoading;
  const isPro = userData?.plan === 'pro';
  const freeAlertLimit = userData?.entitlements?.alerts?.maxActive ?? 1;

  const showLoginWall = !user;
  const showUpgradeWall = user && !isPro && (alerts?.length ?? 0) >= freeAlertLimit;

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

              {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {showLoginWall && !isLoading && (
                 <ProFeatureLock
                    title="Log In to Create Alerts"
                    description={`Create a free account to set up your first alert.`}
                    buttonText="Log In / Sign Up"
                    onButtonClick={() => setAuthDialogOpen(true)}
                  />
              )}
               {showUpgradeWall && !isLoading && (
                 <ProFeatureLock
                    title="Unlock Unlimited Alerts & Advanced Features"
                    description="You've reached your limit of 1 active alert on the free plan. Upgrade to Pro for unlimited alerts, multi-condition rules, and instant Telegram/Discord notifications."
                  />
              )}
          </div>
      </div>
  );
}
