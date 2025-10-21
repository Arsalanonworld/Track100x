
'use client';

import PageHeader from '@/components/page-header';
import { withAuth } from '@/components/auth/withAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { useState } from 'react';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog } from '@/components/ui/dialog';

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

function AlertsPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Create and manage your on-chain alerts. Get notified about significant market movements."
      />
      <AlertsPanel onNewAlert={handleOpenEditor} />

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <AlertEditorDialog onOpenChange={setIsEditorOpen} />
      </Dialog>
    </div>
  );
}

export default withAuth(AlertsPage, { skeleton: PageSkeleton });
