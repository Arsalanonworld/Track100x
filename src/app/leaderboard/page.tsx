'use client';

import { Leaderboard } from '@/components/leaderboard';
import PageHeader from '@/components/page-header';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
       <PageHeader
        title="Whale Leaderboard"
        description="Discover and track the most profitable and active wallets in real-time."
      />
      <Leaderboard />
    </div>
  );
}
