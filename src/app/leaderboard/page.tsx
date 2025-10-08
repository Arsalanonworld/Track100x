
'use client';

import { Leaderboard } from '@/components/leaderboard';
import PageHeader from '@/components/page-header';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Wallet Leaderboard"
        description="Discover top-performing wallets based on their recent trading activity and profitability."
      />
      <Leaderboard />
    </div>
  );
}
