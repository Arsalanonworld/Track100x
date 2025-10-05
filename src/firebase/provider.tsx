'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';
import { UserProvider } from './auth/use-user';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const firebase = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseContext.Provider value={firebase}>
      <UserProvider>
          {children}
      </UserProvider>
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.app;
export const useAuth = () => useContext(FirebaseContext)?.auth;
export const useFirestore = () => useContext(FirebaseContext)?.firestore;