
'use client';

import { SignupForm } from '@/components/auth-components';

export default function SignupPage() {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-md">
                <SignupForm />
            </div>
        </div>
    );
}
