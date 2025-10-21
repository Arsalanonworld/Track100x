
'use client';

import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { useState } from 'react';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog } from '@/components/ui/dialog';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';


function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
                 <Skeleton className="h-10 w-28" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

function AlertsPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user, loading } = useUser();

  const handleOpenEditor = () => {
    if (user) {
        setIsEditorOpen(true);
    }
  }

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Create and manage your on-chain alerts. Get notified about significant market movements."
      />
      
      {user ? (
          <AlertsPanel onNewAlert={handleOpenEditor} />
      ) : (
        <div className="relative min-h-[60vh]">
            <div aria-hidden="true" className="pointer-events-none blur-sm">
                <PageSkeleton />
            </div>
            <FeatureLock />
        </div>
      )}

      {user && (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <AlertEditorDialog onOpenChange={setIsEditorOpen} />
        </Dialog>
      )}
    </div>
  );
}

export default AlertsPage;
