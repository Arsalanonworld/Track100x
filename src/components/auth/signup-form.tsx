
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function GoogleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M21.328 11.408c0-.75-.065-1.48-.19-2.182h-8.83v4.135h5.16a4.575 4.575 0 0 1-1.995 3.035v2.71h3.48c2.04-1.875 3.21-4.73 3.21-7.698Z" />
        <path d="M12.308 21.75c2.445 0 4.49-.805 5.985-2.18l-3.48-2.71a5.45 5.45 0 0 1-2.505.655 5.42 5.42 0 0 1-5.11-3.73H3.788v2.8a10.01 10.01 0 0 0 8.52 4.965Z" />
        <path d="M7.198 12.985a5.95 5.95 0 0 1 0-3.97v-2.8H3.788a10.05 10.05 0 0 0 0 9.57l3.41-2.8Z" />
        <path d="M12.308 6.49a5.3 5.3 0 0 1 3.74 1.465l3.08-3.08A9.76 9.76 0 0 0 12.308 2.25a10.01 10.01 0 0 0-8.52 4.965l3.41 2.8a5.42 5.42 0 0 1 5.11-3.525Z" />
      </g>
    </svg>
  );
}

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      // On success, the useUser hook will handle user creation
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // On success, the useUser hook will handle user creation
    } catch (error: any) {
      setError(error.message);
    }
  };


  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" name="password" type="password" required />
        </div>
         <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
