'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    // The AuthDialog is now the primary way to log in.
    // This page will redirect logged-in users or show the dialog for guests.
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(true);

    useEffect(() => {
        if (!loading && user) {
            router.push('/account');
        }
    }, [user, loading, router]);
    
    // This effect handles closing the dialog. If the user closes it, redirect them home.
    useEffect(() => {
        if (!isAuthDialogOpen && !user) {
            router.push('/');
        }
    }, [isAuthDialogOpen, user, router]);


    if (loading || user) {
        // Show a loading state or nothing while redirecting
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
        </div>
  );
}
