
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { type User, onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../';
import type { UserProfile } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';

type UserContextData = {
  user: User | null;
  claims: { plan?: 'free' | 'pro' } | null;
  loading: boolean;
  profile: UserProfile | null;
};

const UserContext = createContext<UserContextData>({
  user: null,
  claims: null,
  loading: true,
  profile: null,
});

async function createUserProfile(user: User) {
  const db = getFirestore(user.providerData[0]!.providerId === 'firebase' ? getAuth().app : undefined);
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newUserProfile: Omit<UserProfile, 'createdAt'> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      plan: 'free',
    };
    await setDoc(userRef, {...newUserProfile, createdAt: serverTimestamp()});
  }
}

const guestOnlyRoutes = ['/login'];
const proOnlyRedirects = ['/upgrade']; // Pages that Pro users should be redirected away from

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const claims = profile ? { plan: profile.plan } : null;
  const isPro = claims?.plan === 'pro';

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      if (newUser) {
        setUser(newUser);
        await createUserProfile(newUser);
        const db = getFirestore(auth.app);
        const profileUnsubscribe = onSnapshot(doc(db, `users/${newUser.uid}`), (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, () => {
          setLoading(false);
        });

        return () => profileUnsubscribe();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) return;

    // If user is logged in, redirect them away from any guest-only pages.
    if (user) {
      if (guestOnlyRoutes.includes(pathname)) {
        router.replace('/feed');
      }
      // If user is a Pro member, redirect them away from the upgrade page.
      if (isPro && proOnlyRedirects.includes(pathname)) {
          router.replace('/account');
      }
    }
  }, [user, loading, pathname, router, isPro]);

  return (
    <UserContext.Provider value={{ user, claims, loading, profile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
