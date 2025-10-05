'use client';

import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const auth = useAuth();
  const router = useRouter();

  const logout = async () => {
    if (auth) {
      await auth.signOut();
      // Force a redirect to the home page after logout.
      router.push('/');
    }
  };

  return logout;
};
