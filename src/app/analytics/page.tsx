
'use client';

import { withAuth } from '@/components/auth/withAuth';
import { ComingSoon } from '@/components/coming-soon';

function AnalyticsPage() {
    return <ComingSoon featureName="Analytics" />;
}

export default withAuth(AnalyticsPage);
