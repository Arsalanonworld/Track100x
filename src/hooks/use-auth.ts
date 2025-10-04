
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  authDialogOpen: boolean;
  setAuthDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPro: false,
  signOut: async () => {},
  upgradeToPro: async () => {},
  authDialogOpen: false,
  setAuthDialogOpen: () => {},
});

const mockUser: User = {
    uid: 'mock-user-123',
    email: 'pro@track100x.com',
    displayName: 'Pro User',
    photoURL: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Default to Pro for easier testing
  const [isPro, setIsPro] = useState(true); 
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching user
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, []);

  const signOut = async () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsPro(false);
      setLoading(false);
      router.push('/');
    }, 500);
  };

  const upgradeToPro = async () => {
    if (!user) {
        setAuthDialogOpen(true);
        throw new Error('User not logged in.');
    }
    setIsPro(true);
  };

  const value = {
    user,
    loading,
    isPro,
    signOut,
    upgradeToPro,
    authDialogOpen,
    setAuthDialogOpen,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => useContext(AuthContext);
