
'use client';
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface AuthDialogContextType {
  authDialogOpen: boolean;
  setAuthDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(
  undefined
);

export const AuthDialogProvider = ({ children }: { children: ReactNode }) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <AuthDialogContext.Provider value={{ authDialogOpen, setAuthDialogOpen }}>
      {children}
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
};
