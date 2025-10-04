
'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const TestUserContext = createContext({
  isTestUser: false,
  setIsTestUser: (isTest: boolean) => {},
});

export const useTestUser = () => useContext(TestUserContext);

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [isTestUser, setIsTestUser] = useState(false);

  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  const testUserValue = useMemo(() => ({
    isTestUser,
    setIsTestUser
  }), [isTestUser]);

  return (
    <TestUserContext.Provider value={testUserValue}>
      <FirebaseProvider
        firebaseApp={firebaseServices.firebaseApp}
        auth={firebaseServices.auth}
        firestore={firebaseServices.firestore}
      >
        {children}
      </FirebaseProvider>
    </TestUserContext.Provider>
  );
}
