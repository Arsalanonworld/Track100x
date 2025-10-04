'use client';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useTestUser } from '@/firebase/client-provider';

export function useAuth() {
  const { user, isUserLoading } = useUser();
  const { isTestUser, authDialogOpen, setAuthDialogOpen } = useTestUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isPro = isTestUser ? true : userData?.plan === 'pro';
  const isLoading = isUserLoading || isUserDataLoading;

  return { user, isPro, isLoading, isTestUser, authDialogOpen, setAuthDialogOpen };
}
