'use client';

import { withAuth } from '@/components/auth/withAuth';
import { ComingSoon } from '@/components/coming-soon';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';

function AnalyticsPage() {
    const { claims } = useUser();
    const isPro = claims?.plan === 'pro';

    if (!isPro) {
        return (
            <div className="relative h-full">
                <FeatureLock />
                <div className='invisible'>
                    <ComingSoon featureName="Analytics" />
                </div>
            </div>
        )
    }

    return <ComingSoon featureName="Analytics" />;
}

export default withAuth(AnalyticsPage);
