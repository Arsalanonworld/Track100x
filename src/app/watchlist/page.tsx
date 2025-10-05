
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, EyeOff, BellPlus } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc } from 'firebase/firestore';
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FeatureLock } from '@/components/feature-lock';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import QuickAlertEditor from '@/components/alerts/quick-alert-editor';


function WatchlistSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <Skeleton className="h-6 w-32 rounded-md" />
                    </div>
                     <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function WatchlistPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
  const [selectedWatchlistItem, setSelectedWatchlistItem] = useState<WatchlistItem | null>(null);

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  }, [user, firestore]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const { toast } = useToast();

  const handleOpenAlertEditor = (item: WatchlistItem) => {
    setSelectedWatchlistItem(item);
    setIsAlertEditorOpen(true);
  }
  
  const handleCloseAlertEditor = () => {
    setSelectedWatchlistItem(null);
    setIsAlertEditorOpen(false);
  }

  const handleSaveAlert = () => {
    toast({
        title: "Alert created!",
        description: `You'll be notified for activity on ${selectedWatchlistItem?.walletAddress.slice(0, 6)}...`
    });
    handleCloseAlertEditor();
  }

  const handleRemove = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: "Wallet Removed",
            description: `${item.walletAddress.slice(0, 6)}...${item.walletAddress.slice(-4)} removed from watchlist.`
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

  const isLoading = userLoading || (user && watchlistLoading);

  return (
    <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <div className="space-y-8">
                <PageHeader
                    title="Watchlist"
                    description="Monitor the wallets you are tracking."
                />

                {isLoading ? <WatchlistSkeleton /> : (
                <Card>
                    <CardHeader>
                    <CardTitle>Tracked Wallets</CardTitle>
                    <CardDescription>
                        You are watching {watchlist?.length || 0} wallet(s).
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {watchlist && watchlist.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Wallet Address</TableHead>
                                    <TableHead>Date Added</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {watchlist.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono">
                                                {item.walletAddress}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.createdAt?.toDate().toLocaleDateString() ?? 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenAlertEditor(item)}>
                                                <BellPlus className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently remove the wallet <span className='font-mono bg-muted p-1 rounded-sm'>{item.walletAddress.slice(0, 6)}...${item.walletAddress.slice(-4)}</span> from your watchlist.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleRemove(item)}>Remove</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                                <EyeOff className="h-10 w-10 mb-4" />
                                <p className="font-semibold">Your watchlist is empty.</p>
                                <p className="text-sm">
                                    Add wallets from the Top Players page to start tracking.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                )}
            </div>
            
            {selectedWatchlistItem && (
                 <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Create Quick Alert</DialogTitle>
                    </DialogHeader>
                    <QuickAlertEditor 
                        entity={{
                            type: 'Wallet',
                            identifier: selectedWatchlistItem.walletAddress,
                            label: selectedWatchlistItem.walletAddress
                        }}
                        onSave={handleSaveAlert}
                        onCancel={handleCloseAlertEditor}
                    />
                </DialogContent>
            )}
        </div>
    </Dialog>
  );
}
