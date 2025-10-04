
'use client';

import { useUser as useFirebaseUser } from '@/firebase';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const useAuth = () => {
  const { user, isUserLoading, userError } = useFirebaseUser();

  // Here you can add logic to fetch user profile from Firestore
  // and determine if they are a "Pro" user.
  // For now, we will just pass through the Firebase user.

  const isPro = true; // Placeholder

  return {
    user: user as User | null,
    loading: isUserLoading,
    isPro: isPro, // This would be derived from Firestore data
    userError: userError,
  };
};
