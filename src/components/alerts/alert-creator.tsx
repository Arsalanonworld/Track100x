
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { CreateAlertModal } from '@/components/create-alert-modal';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useTestUser } from '@/firebase/client-provider';

export default function AlertCreator() {
  const { user, isUserLoading } = useUser();
  const { isTestUser } = useTestUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const alertsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'alerts');
  }, [firestore, user]);
  const { data: alerts } = useCollection(alertsRef);

  const userPlan = isTestUser ? 'pro' : userData?.plan || 'free';
  const isPro = userPlan === 'pro';

  const activeAlertCount = alerts?.length ?? 0;
  const freeAlertLimit = userData?.entitlements?.alerts?.maxActive ?? 3;
  const canCreateAlert = isPro || activeAlertCount < freeAlertLimit;
  const displayUserId = isTestUser ? 'test-user-id' : user?.uid;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Alert
          </Button>
        </DialogTrigger>
        {displayUserId ? (
          <CreateAlertModal
            isPro={isPro}
            canCreateAlert={canCreateAlert}
            userId={displayUserId}
          />
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Up to Create Alerts</DialogTitle>
              <DialogDescription>
                Create a free account to get started with up to {freeAlertLimit}{' '}
                custom alerts.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full" asChild>
              <a href="/auth/login">Login / Sign Up</a>
            </Button>
          </DialogContent>
        )}
      </Dialog>

      {!isPro && (user || isTestUser) && (
        <Button variant="secondary" asChild className="w-full">
          <a href="/upgrade">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Upgrade to Pro
          </a>
        </Button>
      )}
    </div>
  );
}
