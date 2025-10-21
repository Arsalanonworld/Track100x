
'use client';

import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { useState } from 'react';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog } from '@/components/ui/dialog';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';
import { Button } from '@/components/ui/button';
import { BellPlus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';


function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <div className="flex-1 hidden sm:block">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-5 w-2/3 mt-2" />
                 </div>
                 <Skeleton className="h-10 w-28" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
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
            action={user && <Button onClick={handleOpenEditor}><BellPlus className="h-4 w-4 mr-2" /> New Alert</Button>}
            className='hidden sm:block'
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
