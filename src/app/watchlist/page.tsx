
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, EyeOff, BellPlus, ArrowRight, Pencil, Check, X, Lock, Wallet, Tag } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FeatureLock } from '@/components/feature-lock';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { CreateAlertDialog } from '@/components/create-alert-dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CryptoIcon } from '@/components/crypto-icon';

const WATCHLIST_LIMIT_FREE = 3;

function WatchlistSkeleton() {
    return (
        <div className="divide-y border rounded-lg">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4 flex-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function WatchlistPage() {
  const { user, loading: userLoading, claims } = useUser();
  const firestore = useFirestore();
  const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
  const [selectedWatchlistItem, setSelectedWatchlistItem] = useState<WatchlistItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  }, [user, firestore]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const { toast } = useToast();

  const atLimit = !isPro && watchlist && watchlist.length >= WATCHLIST_LIMIT_FREE;

  const handleOpenAlertEditor = (item: WatchlistItem) => {
    setSelectedWatchlistItem(item);
    setIsAlertEditorOpen(true);
  }

  const handleRemove = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: `${item.type === 'wallet' ? 'Wallet' : 'Token'} Removed`,
            description: `${item.name || item.identifier} removed from watchlist.`
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

  const handleStartEditing = (item: WatchlistItem) => {
    setEditingItemId(item.id);
    setNewName(item.name || '');
  }

  const handleCancelEditing = () => {
    setEditingItemId(null);
    setNewName('');
  }

  const handleSaveName = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    updateDoc(docRef, { name: newName })
      .then(() => {
        toast({ title: 'Name Updated', description: `Item alias saved as "${newName}".` });
        handleCancelEditing();
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { name: newName },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const isLoading = userLoading || (user && watchlistLoading);

  return (
    <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <div className="space-y-8">
                <PageHeader
                    title="Watchlist"
                    description="Monitor your tracked wallets and tokens. Add a custom name for easy tracking."
                />
                
                {atLimit && (
                    <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                        <Lock className="w-8 h-8 text-primary mx-auto" />
                        <h3 className="text-2xl font-bold">Watchlist Limit Reached</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            You've reached the limit of {WATCHLIST_LIMIT_FREE} items for the Free plan. Upgrade to track unlimited wallets and tokens.
                        </p>
                        <Button asChild>
                            <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                        </Button>
                    </Card>
                )}

                <div className="border rounded-lg">
                    {isLoading ? <WatchlistSkeleton /> : watchlist && watchlist.length > 0 ? (
                        <div className="divide-y">
                            {watchlist.map((item) => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex-1 flex items-center gap-4">
                                        {item.type === 'wallet' ? <Wallet className="h-6 w-6 text-muted-foreground shrink-0"/> : <CryptoIcon token={item.identifier} className="h-6 w-6 shrink-0"/>}
                                        <div className="space-y-1 w-full">
                                            {editingItemId === item.id ? (
                                                <div className='flex items-center gap-2 max-w-sm'>
                                                    <Input 
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    placeholder="Enter an alias"
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => handleSaveName(item)}><Check className="h-4 w-4 text-green-500" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={handleCancelEditing}><X className="h-4 w-4 text-destructive" /></Button>
                                                </div>
                                            ) : (
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    {item.name || item.identifier}
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEditing(item)}>
                                                        <Pencil className="h-4 w-4 text-muted-foreground"/>
                                                    </Button>
                                                </h3>
                                            )}
                                            {item.name && <Badge variant="secondary" className="font-mono text-sm">{item.identifier}</Badge>}
                                            <p className="text-xs text-muted-foreground pt-1">
                                                Added on: {item.createdAt?.toDate().toLocaleDateString() ?? 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => handleOpenAlertEditor(item)}>
                                                <BellPlus className="h-4 w-4 mr-2" />
                                                Alert
                                            </Button>
                                        </DialogTrigger>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/5">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently remove <span className='font-mono bg-muted p-1 rounded-sm'>{item.name || item.identifier}</span> from your watchlist.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemove(item)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                            <EyeOff className="h-10 w-10 mb-4" />
                            <p className="font-semibold">Your watchlist is empty.</p>
                            <p className="text-sm max-w-xs mx-auto">
                               Add wallets or tokens from the Whale Feed to start tracking their activity.
                            </p>
                            <Button asChild className='mt-4'>
                                <Link href="/#whale-feed">Go to Whale Feed <ArrowRight className="h-4 w-4 ml-2" /></Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedWatchlistItem && (
                <CreateAlertDialog 
                    onOpenChange={setIsAlertEditorOpen} 
                    entity={{ type: selectedWatchlistItem.type, identifier: selectedWatchlistItem.identifier }}
                />
            )}
        </div>
    </Dialog>
  );
}
