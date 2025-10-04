
'use client';

import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { setAuthDialogOpen } = useAuthDialog();
    const router = useRouter();

    useEffect(() => {
        setAuthDialogOpen(true);
        router.push('/');
    }, [setAuthDialogOpen, router]);
    
    return null;
}
