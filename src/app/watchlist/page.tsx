
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Trash2, BellPlus, ArrowRight, Pencil, Check, X, Lock, Wallet, Eye } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Alert, WatchlistItem } from '@/lib/types';
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
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoIcon } from '@/components/crypto-icon';
import { getExplorerUrl } from '@/lib/explorers';
import ActiveAlerts from '@/components/alerts/active-alerts';
import AlertHistory from '@/components/alerts/alert-history';
import { AddItemForm } from '@/components/watchlist/add-item-form';
import { tokenLibrary } from '@/lib/tokens';


const WATCHLIST_LIMIT_FREE = 5;
const ALERT_LIMIT_FREE = 5;


function WatchlistItemCard({ item, onUpdate, onRemove }: { item: WatchlistItem, onUpdate: (id: string, name: string) => void, onRemove: (item: WatchlistItem) => void}) {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(item.name || '');

    const handleStartEditing = () => {
        setNewName(item.name || '');
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        onUpdate(item.id, newName);
        setIsEditing(false);
    };
    
    const tokenData: any = {
        'ETH': { price: '$3,550.00', change: '+2.5%' },
        'WIF': { price: '$2.50', change: '-5.2%' },
        'PEPE': { price: '$0.000012', change: '+12.1%' },
        'SOL': { price: '$150.25', change: '+1.8%' },
        'BTC': { price: '$68,500.00', change: '+0.5%'},
        'USDT': { price: '$1.00', change: '+0.0%' },
        'USDC': { price: '$1.00', change: '+0.0%' },
    }
    
    if (!item.identifier) return null;

    const currentToken = tokenLibrary[item.identifier.toUpperCase()];
    const currentTokenMockData = tokenData[item.identifier.toUpperCase()];

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Card className='group'>
                <CardContent className='p-4'>
                    <div className='flex items-start gap-4'>
                        {/* Icon */}
                        <div className='mt-1'>
                            {item.type === 'wallet' ? <Wallet className="h-6 w-6 text-muted-foreground"/> : <CryptoIcon token={item.identifier} className="h-6 w-6"/>}
                        </div>

                        {/* Main Content */}
                        <div className='flex-1 space-y-2 min-w-0'>
                           {item.type === 'wallet' ? (
                                <>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={newName} 
                                            onChange={e => setNewName(e.target.value)} 
                                            placeholder='Set an alias' 
                                            className="h-9"
                                        />
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-9 w-9 text-green-500 hover:text-green-600">
                                            <Check className='h-5 w-5'/>
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={handleCancelEditing} className="h-9 w-9 text-red-500 hover:text-red-600">
                                            <X className='h-5 w-5'/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-1'>
                                        <h3 className='text-lg font-semibold truncate'>
                                            {item.name || item.identifier}
                                        </h3>
                                        <Button size="icon" variant="ghost" className='h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity' onClick={handleStartEditing}><Pencil className='h-4 w-4'/></Button>
                                    </div>
                                )}
                                {item.name && (
                                    <a href={getExplorerUrl('ethereum', item.identifier, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-block truncate max-w-full'>
                                        {item.identifier}
                                    </a>
                                )}
                                 <div className='text-sm text-muted-foreground pt-1 flex items-center gap-4'>
                                    <p>Net Worth: <span className='text-green-500 font-medium'>$1.2M</span></p>
                                    <p>7d P&L: <span className='text-red-500 font-medium'>-$50.2k</span></p>
                                </div>
                                </>
                           ) : (
                                <div className='grid grid-cols-2 items-start'>
                                    <div>
                                        <h3 className='text-lg font-semibold truncate'>
                                            {currentToken?.name || item.name || item.identifier}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">{item.identifier}</p>
                                        
                                        {currentTokenMockData && (
                                            <div className='flex items-center gap-3 text-sm mt-2'>
                                                <span className='text-foreground font-medium'>{currentTokenMockData.price}</span>
                                                <span className={currentTokenMockData.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{currentTokenMockData.change}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                           )}
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1'>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setIsAlertEditorOpen(true)}>
                                    <BellPlus className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Alert</span>
                                </Button>
                            </DialogTrigger>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/5 h-9 w-9">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove <span className='font-mono bg-muted p-1 rounded-sm'>{item.name || item.identifier}</span> from your watchlist and delete any associated alerts.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onRemove(item)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
             {isAlertEditorOpen && (
                <AlertEditorDialog 
                    onOpenChange={setIsAlertEditorOpen} 
                    entity={{ type: item.type, identifier: item.identifier }}
                />
            )}
        </Dialog>
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
                                <Skeleton className="h-9 w-24 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function WatchlistPage() {
  const { user, loading: userLoading, claims } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore, refreshKey]);

  const alertsQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/alerts`));
    }
    return null;
  }, [user, firestore, refreshKey]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
  
  const watchlistAtLimit = !isPro && watchlist && watchlist.length >= WATCHLIST_LIMIT_FREE;
  const alertsAtLimit = !isPro && alerts && alerts.length >= ALERT_LIMIT_FREE;

  const handleRemove = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: `${item.type === 'wallet' ? 'Wallet' : 'Token'} Removed`,
            description: `${item.name || item.identifier} removed from your watchlist.`
        });
        // TODO: Also delete associated alerts
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

  const isLoading = userLoading || (user && (watchlistLoading || alertsLoading));

  const pageDescription = isPro
    ? 'Add wallets or tokens to start tracking their activity.'
    : `Add a new wallet or token to start tracking. Free plan includes ${WATCHLIST_LIMIT_FREE} watchlist items and ${ALERT_LIMIT_FREE} alerts.`;


  return (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <div className="relative">
                {!user && !userLoading && <FeatureLock />}
                <div className="space-y-8">
                    <PageHeader
                        title="Your Watchlist"
                        description={pageDescription}
                        action={
                             <DialogTrigger asChild>
                                <Button>Create New Alert</Button>
                            </DialogTrigger>
                        }
                    />

                    <AddItemForm atLimit={!!watchlistAtLimit} onAdd={() => setRefreshKey(k => k + 1)}/>

                    {watchlistAtLimit && (
                        <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                            <Lock className="w-8 h-8 text-primary mx-auto" />
                            <h3 className="text-2xl font-bold">Watchlist Limit Reached</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                You've reached the limit of ${WATCHLIST_LIMIT_FREE} items for the Free plan. Upgrade to track unlimited wallets and tokens.
                            </p>
                            <Button asChild>
                                <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                            </Button>
                        </Card>
                    )}

                    <div className="space-y-4">
                        <h2 className='text-2xl font-bold tracking-tight'>Tracked Items</h2>
                        {isLoading ? <WatchlistSkeleton /> : watchlist && watchlist.length > 0 ? (
                            watchlist.map((item) => (
                               <WatchlistItemCard key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
                            ))
                        ) : (
                           !isLoading && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                                <Eye className="h-10 w-10 mb-4" />
                                <p className="font-semibold text-lg">Your watchlist is empty.</p>
                                <p className="text-sm max-w-xs mx-auto">
                                   Use the form above or add wallets and tokens directly from the Whale Feed.
                                </p>
                            </div>
                           )
                        )}
                    </div>
                     {alertsAtLimit && (
                        <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                            <Lock className="w-8 h-8 text-primary mx-auto" />
                            <h3 className="text-2xl font-bold">Alert Limit Reached</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                You've reached the limit of ${ALERT_LIMIT_FREE} alerts for the Free plan. Upgrade to create unlimited alerts.
                            </p>
                            <Button asChild>
                                <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                            </Button>
                        </Card>
                    )}

                    <div className="space-y-8 pt-8">
                         <div className='space-y-4'>
                            <ActiveAlerts />
                         </div>
                         <AlertHistory />
                    </div>

                </div>
            </div>
             <AlertEditorDialog 
                onOpenChange={setIsEditorOpen} 
            />
        </Dialog>
  );
}

    