
'use client';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import AlertCreatorCard from '@/components/alerts/alert-creator-card';
import PageHeader from '@/components/page-header';

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Alerts"
        description="Track whales, wallets, and tokens in real-time. Never miss a big move."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <AlertCreatorCard />
        </div>
        <div className="lg:col-span-3 space-y-8">
          <ActiveAlerts />
          <AlertHistory />
        </div>
      </div>
    </div>
  );
}
