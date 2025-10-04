
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickAlertConfigurator } from '../quick-alert-configurator';
import AlertBuilder from './alert-builder';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Lock, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import Link from 'next/link';
import { AnimatedButton } from '../ui/animated-button';

export default function AlertCreatorCard() {
  const { user, isUserLoading } = useUser();
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
  const canCreateAlert = isPro || (alerts?.length ?? 0) < freeAlertLimit;

  const userId = user?.uid;

  if (isLoading) {
      return <Skeleton className="h-[500px] w-full" />;
  }
  
  if (!userId) {
      return null;
  }

  if (!canCreateAlert) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>
            Build a custom alert to track on-chain activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert className="bg-primary/5 border-primary/20 text-primary-foreground text-center flex flex-col items-center">
              <Sparkles className="h-6 w-6 text-primary mb-2" />
              <AlertTitle className="text-primary font-bold">Free Alert Limit Reached</AlertTitle>
              <AlertDescription className="mb-4">
                  You have used your alert on the free plan. Upgrade to Pro for unlimited advanced alerts.
              </AlertDescription>
              <AnimatedButton asChild>
                  <Link href="/upgrade">Upgrade to Pro</Link>
              </AnimatedButton>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Alert</CardTitle>
        <CardDescription>
          Build a custom alert to track on-chain activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPro}>
                 <div className="flex items-center gap-2">
                    {!isPro && <Lock className="h-3 w-3" />}
                    Advanced Builder
                </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator isPro={isPro} userId={userId} />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            <AlertBuilder onSave={() => {}} isPro={isPro} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
