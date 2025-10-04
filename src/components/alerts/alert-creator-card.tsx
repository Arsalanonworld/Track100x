
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Lock } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function AlertCreatorCard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const isLoading = isUserLoading || isUserDataLoading;

  const isPro = userData?.plan === 'pro'; 

  const userId = user?.uid;

  if (isLoading) {
      return <Skeleton className="h-[500px] w-full" />;
  }
  
  if (!userId) {
      return null;
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
            <AlertBuilder onSave={() => {}} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
