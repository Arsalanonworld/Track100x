
'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    // The dialog is always "open" on this page by default.
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(true);

    useEffect(() => {
        // If the user closes the dialog without logging in, send them to the home page.
        // This is the only way to "leave" the login page without authenticating.
        if (!isAuthDialogOpen && !user) {
            router.push('/');
        }
    }, [isAuthDialogOpen, user, router]);

    // The useUser hook handles redirecting already-logged-in users away from this page.
    // We just need to show a loading state while that happens.
    if (loading || user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="space-y-4 w-full max-w-sm">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
        </div>
  );
}
