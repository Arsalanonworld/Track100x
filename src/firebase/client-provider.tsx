
'use client';

import React, {
  useMemo,
  type ReactNode,
  createContext,
  useState,
  useContext,
} from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const TestUserContext = createContext({
  isTestUser: false,
  setIsTestUser: (isTest: boolean) => {},
  authDialogOpen: false,
  setAuthDialogOpen: (isOpen: boolean) => {},
});

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [isTestUser, setIsTestUser] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  const testUserValue = useMemo(
    () => ({
      isTestUser,
      setIsTestUser,
      authDialogOpen,
      setAuthDialogOpen,
    }),
    [isTestUser, authDialogOpen]
  );

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

export const useTestUser = () => useContext(TestUserContext);
