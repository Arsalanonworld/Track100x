'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { useUser } from '@/firebase';
import { FeatureLock } from '@/components/feature-lock';

export default function AlertsPage() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const { user, loading: userLoading } = useUser();

    return (
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <div className="space-y-8">
                    <PageHeader
                        title="Alerts"
                        description="Manage your on-chain alerts and view their trigger history."
                    />
                    <div className="flex justify-end">
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Alert
                            </Button>
                        </DialogTrigger>
                    </div>

                    <div className="space-y-8">
                        <ActiveAlerts />
                        <AlertHistory />
                    </div>
                </div>
                {isEditorOpen && <AlertEditorDialog onOpenChange={setIsEditorOpen} />}
            </Dialog>
        </div>
    );
}
