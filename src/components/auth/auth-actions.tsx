'use client';

import { useAuth } from '@/firebase';

export const useLogout = () => {
  const auth = useAuth();

  const logout = async () => {
    if (auth) {
      await auth.signOut();
      // While revalidatePath and redirect are server-side functions,
      // in this client-side context, we'll rely on Next.js's router
      // to handle the page refresh after logout, which is managed
      // by the onIdTokenChanged listener in the useUser hook.
      // For an explicit redirect, we can use useRouter from next/navigation.
      // The current setup implicitly handles the UI update.
    }
  };

  return logout;
};
