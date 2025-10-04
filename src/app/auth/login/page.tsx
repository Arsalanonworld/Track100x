
'use client';

import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { setAuthDialogOpen } = useAuthDialog();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setAuthDialogOpen(true);
        // We pass the search params from this page to the main page
        // so the auth dialog can pick them up (e.g. `next` url)
        const params = new URLSearchParams(searchParams.toString());
        router.replace(`/?${params.toString()}`);
    }, [setAuthDialogOpen, router, searchParams]);
    
    return null; // This page just triggers the dialog and redirects
}
