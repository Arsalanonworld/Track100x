'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useFirebase } from '@/firebase';

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
    const closeDialog = () => onOpenChange(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Log In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="pt-4">
                        <LoginTab closeDialog={closeDialog} />
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <SignUpTab closeDialog={closeDialog} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

const LoginTab = ({ closeDialog }: { closeDialog: () => void }) => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const [showReset, setShowReset] = useState(false);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: 'Login successful!' });
            closeDialog();
        } catch (error: any) {
            toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast({ title: 'Signed in with Google!' });
            closeDialog();
        } catch (error: any) {
            toast({ title: 'Google Sign-In Failed', description: error.message, variant: 'destructive' });
        }
    };

    if (showReset) {
        return <ResetPasswordTab onBack={() => setShowReset(false)} />;
    }

    return (
        <div className="space-y-4">
            <DialogHeader className="text-center space-y-2">
                <DialogTitle>Welcome Back</DialogTitle>
                <DialogDescription>Log in to access your dashboard and alerts.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button onClick={() => setShowReset(true)} className="text-xs text-primary hover:underline">
                        Forgot password?
                    </button>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleLogin}>Log In</Button>
            <Separator className="my-2" />
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>Continue with Google</Button>
        </div>
    );
};

const SignUpTab = ({ closeDialog }: { closeDialog: () => void }) => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast({ title: 'Account created!', description: "Welcome to Track100x." });
            closeDialog();
        } catch (error: any) {
            toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast({ title: 'Signed in with Google!' });
            closeDialog();
        } catch (error: any) {
            toast({ title: 'Google Sign-In Failed', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-4">
            <DialogHeader className="text-center space-y-2">
                <DialogTitle>Create an Account</DialogTitle>
                <DialogDescription>Start tracking whale wallets in minutes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleSignUp}>Create Account</Button>
            <Separator className="my-2" />
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>Continue with Google</Button>
        </div>
    );
};

const ResetPasswordTab = ({ onBack }: { onBack: () => void }) => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState('');
    const { toast } = useToast();

    const handleReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Password Reset Email Sent',
                description: 'Please check your inbox for instructions.',
            });
            onBack();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-4">
             <DialogHeader className="text-center space-y-2">
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>Enter your email to receive a password reset link.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleReset}>Send Reset Link</Button>
            <DialogFooter className="pt-2">
                 <Button variant="link" onClick={onBack} className="w-full">Back to Log In</Button>
            </DialogFooter>
        </div>
    );
};
