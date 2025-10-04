'use client';

import { useFormState } from 'react-dom';
import {
  login,
  signup,
  resetPassword,
} from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

function AuthError({ error }: { error?: string | null }) {
    if (!error) return null;
  
    // Special case for Firebase auth errors during development
    if (process.env.NODE_ENV === 'development' && error.includes('Firebase: Error')) {
        return (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                <p>Please check the following:</p>
                <ul className="list-disc pl-5 mt-2 text-xs">
                    <li>Ensure Firebase Authentication is enabled in your project.</li>
                    <li>Verify that the Email/Password sign-in provider is enabled.</li>
                    <li>Check your Firestore security rules to allow user creation.</li>
                </ul>
              </AlertDescription>
            </Alert>
          );
    }
  
    return (
        <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

export function LoginForm() {
  const [state, formAction] = useFormState(login, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Welcome back. Log in to access your alerts and dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <AuthError error={state?.error} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Log In
          </Button>
          <div className="text-center text-sm">
            <Link href="/auth/reset-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function SignupForm() {
    const [state, formAction] = useFormState(signup, null);
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Sign up to create custom alerts and track your favorite wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <AuthError error={state?.error} />
          <input type="hidden" name="next" value={next} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


export function ResetPasswordForm() {
    const [state, formAction] = useFormState(resetPassword, null);
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.message ? (
            <Alert>
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : (
            <form action={formAction} className="space-y-4">
              <AuthError error={state?.error} />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
           <div className="mt-4 text-center text-sm">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
