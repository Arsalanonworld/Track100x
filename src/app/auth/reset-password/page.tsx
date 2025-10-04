
'use client';

import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
    const { setAuthDialogOpen } = useAuthDialog();
    const router = useRouter();

    useEffect(() => {
        setAuthDialogOpen(true);
        // We can add logic here to switch to the reset password tab in the dialog
        router.push('/?action=reset-password');
    }, [setAuthDialogOpen, router]);
    
    return null;
}
