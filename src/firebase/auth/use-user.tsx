
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { type User, onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth } from '../';
import type { UserProfile } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';

type UserContextData = {
  user: User | null;
  claims: { plan?: 'free' | 'pro' } | null; // Using profile for plan
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // The 'claims' object is now derived from the profile for consistency
  const claims = profile ? { plan: profile.plan } : null;
  
  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      if (newUser) {
        setUser(newUser);
        // We now primarily rely on the Firestore profile for plan info.
        // Custom claims on the token can still be used for security rules,
        // but the UI will use the profile.
        const db = getFirestore(auth.app);
        const profileUnsubscribe = onSnapshot(doc(db, `users/${newUser.uid}`), (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            // This case can happen briefly if the profile hasn't been created yet.
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
