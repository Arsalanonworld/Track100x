
'use client';

import { LoginForm } from '@/components/auth-components';

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
