
'use client';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { login, signup, resetPassword } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, Terminal, CheckCircle } from 'lucide-react';
import { useAuthDialog } from '@/hooks/use-auth-dialog';

function AuthError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

function AuthSuccess({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
     <Alert className="mb-4 border-green-500/50 text-green-700 dark:border-green-500/30 [&>svg]:text-green-700 dark:[&>svg]:text-green-500 dark:text-green-400">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

const SubmitButton = ({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) => {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
};


const LoginTab = ({ closeDialog }: { closeDialog: () => void }) => {
  const [state, formAction, pending] = useActionState(login, { error: null });
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const action = searchParams.get('action');

  if (action === 'reset-password') {
    return <ResetPasswordTab />;
  }

  return (
    <form action={formAction} className="space-y-4">
        <DialogHeader className="text-center space-y-2">
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>
            Log in to access your dashboard and alerts.
            </DialogDescription>
        </DialogHeader>
      <AuthError error={state?.error} />
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
             <a
                href="/auth/reset-password"
                className="text-xs text-primary hover:underline"
            >
                Forgot password?
            </a>
        </div>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton pending={pending}>Log In</SubmitButton>
    </form>
  );
};

const SignUpTab = ({ closeDialog }: { closeDialog: () => void }) => {
  const [state, formAction, pending] = useActionState(signup, { error: null });
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  return (
    <form action={formAction} className="space-y-4">
        <DialogHeader className="text-center space-y-2">
            <DialogTitle>Create an Account</DialogTitle>
            <DialogDescription>
            Start tracking wallets in minutes.
            </DialogDescription>
        </DialogHeader>
      <AuthError error={state?.error} />
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" name="password" type="password" required minLength={6} />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long.</p>
      </div>
      <SubmitButton pending={pending}>Create Account</SubmitButton>
    </form>
  );
};

const ResetPasswordTab = () => {
  const [state, formAction, pending] = useActionState(resetPassword, { error: null, message: null });

  return (
    <div className="space-y-4">
        <DialogHeader className="text-center space-y-2">
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
            Enter your email to receive a password reset link.
            </DialogDescription>
        </DialogHeader>
        <AuthSuccess message={state?.message} />
        <AuthError error={state?.error} />
        
        {!state.message && (
             <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <SubmitButton pending={pending}>Send Reset Link</SubmitButton>
            </form>
        )}

        <a href="/auth/login" className="inline-block w-full text-center text-sm text-primary hover:underline">
          Back to Log In
        </a>
    </div>
  );
};


export default function AuthDialog() {
  const { authDialogOpen, setAuthDialogOpen } = useAuthDialog();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const [activeTab, setActiveTab] = useState(action === 'signup' ? 'signup' : 'login');
  
  useEffect(() => {
    if (action === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [action]);

  const CurrentTab = () => {
      if(action === 'reset-password') {
          return <ResetPasswordTab />
      }
      if(activeTab === 'signup') {
          return <SignUpTab closeDialog={() => setAuthDialogOpen(false)} />
      }
      return <LoginTab closeDialog={() => setAuthDialogOpen(false)} />
  }

  return (
    <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
      <DialogContent className="sm:max-w-md">
        {action === 'reset-password' ? (
            <CurrentTab />
        ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
                <LoginTab closeDialog={() => setAuthDialogOpen(false)} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
                <SignUpTab closeDialog={() => setAuthDialogOpen(false)} />
            </TabsContent>
            </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
