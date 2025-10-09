'use client';

import PageHeader from '@/components/page-header';
import { WhaleChart } from '@/components/whale-chart';

export default function ChartPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Whale Activity Matrix"
        description="Visualize whale movements across multiple dimensions to reveal market signals."
      />
      <WhaleChart />
    </div>
  );
}
