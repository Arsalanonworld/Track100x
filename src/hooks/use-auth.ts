
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuthDialog } from './use-auth-dialog';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

export const useAuth = () => {
  const { user, isUserLoading, userError } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isPro = userData?.plan === 'pro';

  return {
    user,
    loading: isUserLoading || isUserDataLoading,
    isPro,
    userError,
    setAuthDialogOpen,
  };
};
