
'use client';

import { Leaderboard } from '@/components/leaderboard';
import PageHeader from '@/components/page-header';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
       <PageHeader
        title="Smart Money Dashboard"
        description="Discover and track the most influential and profitable wallets in real-time."
      />
      <Leaderboard />
    </div>
  );
}
