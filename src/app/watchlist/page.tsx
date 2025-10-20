
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Wallet, Eye, Lock, BellPlus } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { withAuth } from '@/components/auth/withAuth';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WatchlistActionForm } from '@/components/watchlist/watchlist-action-form';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog } from '@/components/ui/dialog';
import { WatchlistItemCard } from '@/components/watchlist/watchlist-item-card';
import { Button } from '@/components/ui/button';


const WATCHLIST_LIMIT_FREE = 5;

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
}

function WatchlistSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-8 w-8 rounded-full mt-1" />
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function WatchlistPage() {
  const { user, claims, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorEntity, setEditorEntity] = useState<{type: 'wallet' | 'token', identifier: string} | undefined>(undefined);
  
  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  
  const isLoading = userLoading || (user && watchlistLoading);
  const watchlistAtLimit = !isPro && watchlist && watchlist.length >= WATCHLIST_LIMIT_FREE;

  const pageDescription = isPro
    ? 'Track your wallets and tokens all in one place.'
    : `You are on the Free plan. Upgrade to unlock all features.`;


  const handleRemove = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: `${item.type === 'wallet' ? 'Wallet' : 'Token'} Removed`,
            description: `${item.name || item.identifier} removed from your watchlist.`
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }
  
  const handleUpdate = (id: string, name: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, id);
    updateDoc(docRef, { name })
      .then(() => {
        toast({ title: 'Alias Updated', description: `Item alias has been updated.` });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { name },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const handleOpenEditor = (entity: {type: 'wallet' | 'token', identifier: string}) => {
    setEditorEntity(entity);
    setIsEditorOpen(true);
  }
  
  const handleItemAdded = (entity: {type: 'wallet' | 'token', identifier: string}) => {
    // Open the alert editor right after adding an item
    handleOpenEditor(entity);
  }
  
  return (
    <div className="space-y-8">
         <PageHeader
            title="My Watchlist"
            description={pageDescription}
        />

        <div className='space-y-6'>
            <WatchlistActionForm 
                user={user}
                onItemAdded={handleItemAdded}
                atLimit={!!watchlistAtLimit}
                isLoading={isLoading}
            />
            
            {watchlistAtLimit && (
                <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                    <Lock className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold">Watchlist Limit Reached</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        You've reached the limit of ${WATCHLIST_LIMIT_FREE} items for the Free plan. Upgrade to track unlimited wallets and tokens.
                    </p>
                    <Button asChild>
                        <Link href="/upgrade">Upgrade to Pro</Link>
                    </Button>
                </Card>
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle>Tracked Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? <WatchlistSkeleton /> : user && watchlist && watchlist.length > 0 ? (
                            watchlist.map((item) => (
                            <WatchlistItemCard 
                                key={item.id} 
                                item={item} 
                                onUpdate={handleUpdate} 
                                onRemove={handleRemove}
                                onAlertCreate={handleOpenEditor}
                                />
                            ))
                        ) : (
                        !isLoading && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed h-48">
                                <Eye className="h-10 w-10 mb-4" />
                                <p className="font-semibold text-lg text-foreground">Your watchlist is empty</p>
                                <p className="text-sm max-w-xs mx-auto">
                                Use the form above to add wallets or tokens to begin.
                                </p>
                            </div>
                        )
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <AlertEditorDialog onOpenChange={setIsEditorOpen} entity={editorEntity} />
        </Dialog>
    </div>
  );
}

export default withAuth(WatchlistPage, { skeleton: PageSkeleton });
