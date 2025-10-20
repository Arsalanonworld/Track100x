'use client';

import { withAuth } from '@/components/auth/withAuth';
import { ComingSoon } from '@/components/coming-soon';

function TokenPage({ params }: { params: { symbol: string } }) {
    const featureName = `Token Analytics: ${params.symbol.toUpperCase()}`;
    return <ComingSoon featureName={featureName} />;
}

export default withAuth(TokenPage);
