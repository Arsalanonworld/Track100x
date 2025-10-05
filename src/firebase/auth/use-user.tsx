'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { type User, onIdTokenChanged, getIdTokenResult } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth } from '../';
import type { UserProfile } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';

type UserContextData = {
  user: User | null;
  claims: any | null;
  loading: boolean;
  profile: UserProfile | null;
};

const UserContext = createContext<UserContextData>({
  user: null,
  claims: null,
  loading: true,
  profile: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      if (newUser) {
        setUser(newUser);
        const tokenResult = await getIdTokenResult(newUser);
        setClaims(tokenResult.claims);

        const db = getFirestore(auth.app);
        const profileUnsubscribe = onSnapshot(doc(db, `users/${newUser.uid}`), (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });

        return () => profileUnsubscribe();
      } else {
        setUser(null);
        setClaims(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // If the user is logged in and on the login page, redirect them to the home page.
    if (!loading && user && pathname === '/login') {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  return (
    <UserContext.Provider value={{ user, claims, loading, profile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
