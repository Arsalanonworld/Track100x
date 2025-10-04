
'use client';

import { useAuthDialog } from './use-auth-dialog';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const useAuth = () => {
  const { setAuthDialogOpen } = useAuthDialog();
  
  // Mock user for testing purposes
  const mockUser: User = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
  };

  return {
    user: mockUser,
    loading: false,
    isPro: true, // Always return true for isPro
    userError: null,
    setAuthDialogOpen,
  };
};
