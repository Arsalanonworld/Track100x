
'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(true);

    useEffect(() => {
        // If the user closes the dialog without logging in, send them home.
        if (!isAuthDialogOpen && !user) {
            router.push('/');
        }
    }, [isAuthDialogOpen, user, router]);

    // The useUser hook handles redirecting logged-in users away from this page.
    if (loading || user) {
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
