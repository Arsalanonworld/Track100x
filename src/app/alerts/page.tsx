
'use client';

import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { useState } from 'react';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog } from '@/components/ui/dialog';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellPlus } from 'lucide-react';

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
        <Card>
            <CardHeader>
                <CardTitle>Manage Alerts</CardTitle>
                <CardDescription>
                    Log in to create and manage your alerts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed h-64">
                    <BellPlus className="h-10 w-10 mb-4" />
                    <p className="font-semibold text-lg text-foreground">Log in to create alerts</p>
                    <p className="text-sm max-w-xs mx-auto mb-6">
                    Sign up for a free account to get started.
                    </p>
                    <Button asChild>
                        <Link href="/login">
                            Log In / Sign Up
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
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
