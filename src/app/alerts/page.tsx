
'use client';

import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { useState } from 'react';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog } from '@/components/ui/dialog';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertHistory } from '@/components/alerts/alert-history';


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
            description="Create, manage, and review your on-chain alerts."
            className='hidden sm:block'
        />
      
      {user ? (
          <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                  <TabsTrigger value="active">Active Alerts</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <AlertsPanel onNewAlert={handleOpenEditor} />
              </TabsContent>
              <TabsContent value="history">
                <AlertHistory />
              </TabsContent>
          </Tabs>
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
