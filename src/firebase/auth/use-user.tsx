
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
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      plan: 'free',
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newUserProfile);
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const claims = profile ? { plan: profile.plan } : null;

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
    if (!loading && user && pathname === '/login') {
      router.push('/account');
    }
  }, [user, loading, pathname, router]);

  return (
    <UserContext.Provider value={{ user, claims, loading, profile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
