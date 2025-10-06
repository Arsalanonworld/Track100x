
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Trash2, BellPlus, ArrowRight, Pencil, Check, X, Lock, Wallet, Plus, Edit } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { FeatureLock } from '@/components/feature-lock';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { CreateAlertDialog } from '@/components/create-alert-dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoIcon } from '@/components/crypto-icon';
import { getExplorerUrl } from '@/lib/explorers';
import { Label } from '@/components/ui/label';
import { AdCard } from '@/components/ad-card';
import { tokenLibrary } from '@/lib/tokens';

const WATCHLIST_LIMIT_FREE = 5;

function AddItemForm({ atLimit, onAdd }: { atLimit: boolean, onAdd: () => void }) {
  const [identifier, setIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<{ identifier: string; type: 'wallet' | 'token' } | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isWalletAddress = (str: string) => /^0x[a-fA-F0-9]{40}$/.test(str);
  const isTokenSymbol = (str: string) => /^[A-Z]{2,6}$/.test(str.toUpperCase());

  const handleAddClick = async () => {
    if (!identifier) {
      toast({ variant: 'destructive', title: 'Identifier required', description: 'Please enter a wallet address or token symbol.' });
      return;
    }

    const upperIdentifier = identifier.toUpperCase();
    const type = isWalletAddress(identifier) ? 'wallet' : isTokenSymbol(upperIdentifier) ? 'token' : null;
    
    if (!type) {
        toast({ variant: 'destructive', title: 'Invalid Identifier', description: 'Please enter a valid ETH wallet address or a 2-6 character token symbol.' });
        return;
    }

    if (atLimit) {
        toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
        return;
    }

    const finalIdentifier = type === 'token' ? upperIdentifier : identifier;

    setItemToAdd({ identifier: finalIdentifier, type });

    if (type === 'token') {
      // Skip alias for tokens, add directly
      await confirmAddItem(finalIdentifier, type, '');
    } else {
      setIsAliasModalOpen(true);
    }
  };

  const confirmAddItem = async (id: string, type: 'wallet' | 'token', name: string) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    
    try {
        const q = query(collection(firestore, `users/${user.uid}/watchlist`), where("identifier", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            toast({ variant: 'destructive', title: 'Already Watched', description: `${id} is already on your watchlist.` });
            setIsSubmitting(false);
            setIsAliasModalOpen(false);
            return;
        }

        const newDoc: Omit<WatchlistItem, 'id' | 'createdAt'> & { createdAt: any } = {
            identifier: id,
            type: type,
            name: name,
            userId: user.uid,
            createdAt: serverTimestamp(),
        };

        await addDoc(collection(firestore, `users/${user.uid}/watchlist`), newDoc);
        toast({ title: 'Item Added!', description: `${id} has been added to your watchlist.` });
        onAdd();
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}/watchlist`,
            operation: 'create',
            requestResourceData: { identifier: id, type: type, name: name }
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setIsSubmitting(false);
        setIsAliasModalOpen(false);
        setIdentifier('');
        setAlias('');
    }
  }

  const handleWalletAliasSubmit = () => {
    if (itemToAdd) {
        confirmAddItem(itemToAdd.identifier, itemToAdd.type, alias);
    }
  }


  return (
    <>
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        placeholder="Enter Wallet Address or Token Symbol (e.g., ETH)"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={atLimit}
                    />
                    <Button onClick={handleAddClick} disabled={atLimit || !identifier} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Item
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Dialog open={isAliasModalOpen} onOpenChange={setIsAliasModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add to Watchlist</DialogTitle>
                    <DialogDescription>
                        Optionally, add an alias for <span className='font-mono bg-muted p-1 rounded-sm'>{itemToAdd?.identifier}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="alias">Alias</Label>
                    <Input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="e.g., My Trading Wallet"/>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAliasModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleWalletAliasSubmit} disabled={isSubmitting}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}


function WatchlistItemCard({ item, onUpdate, onRemove }: { item: WatchlistItem, onUpdate: (id: string, name: string) => void, onRemove: (item: WatchlistItem) => void}) {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(item.name || '');

    const handleStartEditing = () => {
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
        setNewName(item.name || '');
    };

    const handleSave = () => {
        onUpdate(item.id, newName);
        setIsEditing(false);
    };
    
    const tokenData: any = {
        'ETH': { price: '$3,550.00' },
        'WIF': { price: '$2.50' },
        'PEPE': { price: '$0.000012' },
        'SOL': { price: '$150.25' },
        'BTC': { price: '$68,500.00'},
        'USDT': { price: '$1.00'},
        'USDC': { price: '$1.00'},
    }
    
    if (!item.identifier) return null;

    const currentToken = tokenLibrary[item.identifier.toUpperCase()];
    const currentTokenMockPrice = tokenData[item.identifier.toUpperCase()];


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
                                isEditing ? (
                                    <div className='flex items-center gap-2'>
                                        <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder='Set an alias' />
                                        <Button size="icon" variant="ghost" onClick={handleSave}><Check className='h-4 w-4 text-green-500'/></Button>
                                        <Button size="icon" variant="ghost" onClick={handleCancelEditing}><X className='h-4 w-4 text-red-500'/></Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='text-lg font-semibold truncate'>
                                                {item.name || item.identifier}
                                            </h3>
                                           {item.type === 'wallet' && (
                                                <Button size="icon" variant="ghost" className='h-7 w-7 opacity-0 group-hover:opacity-100' onClick={handleStartEditing}><Edit className='h-4 w-4'/></Button>
                                            )}
                                        </div>
                                        {item.name && (
                                            <a href={getExplorerUrl('ethereum', item.identifier, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-block truncate max-w-full'>
                                                {item.identifier}
                                            </a>
                                        )}
                                    </>
                                )
                           ) : (
                                <>
                                    <h3 className='text-lg font-semibold truncate'>
                                        {currentToken?.name || item.name || item.identifier}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-mono">{item.identifier}</p>
                                </>
                           )}

                            <div className='text-sm text-muted-foreground pt-1'>
                                {item.type === 'wallet' ? (
                                    <p>Last Activity: <span className='text-green-500 font-medium'>$500K ETH tx, 2h ago</span></p>
                                ) : (
                                     currentTokenMockPrice ? (
                                        <p>Price: <span className='text-foreground font-medium'>{currentTokenMockPrice.price}</span> <span className='text-red-500 font-medium ml-2'>-5.2%</span></p>
                                    ) : (
                                        <p>Price: <span className='text-foreground font-medium'>$0.00</span> <span className='text-muted-foreground font-medium ml-2'>-</span></p>
                                    )
                                )}
                            </div>
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
                                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/5">
                                        <Trash2 className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Remove</span>
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
                                    <AlertDialogAction onClick={() => onRemove(item)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
             {isAlertEditorOpen && (
                <CreateAlertDialog 
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
                                <Skeleton className="h-9 w-20 rounded-md" />
                                <Skeleton className="h-9 w-20 rounded-md" />
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

  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore, refreshKey]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  
  const atLimit = !isPro && watchlist && watchlist.length >= WATCHLIST_LIMIT_FREE;

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

  const isLoading = userLoading || (user && watchlistLoading);

  const pageDescription = isPro
    ? 'Track unlimited wallets and tokens with your Pro plan.'
    : `Track up to ${WATCHLIST_LIMIT_FREE} wallets/tokens on the free plan. Upgrade for more.`;


  return (
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <div className="space-y-8">
                <PageHeader
                    title="Your Watchlist"
                    description={pageDescription}
                />
                
                <AddItemForm atLimit={!!atLimit} onAdd={() => setRefreshKey(k => k + 1)}/>

                {atLimit && (
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

                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? <WatchlistSkeleton /> : watchlist && watchlist.length > 0 ? (
                        watchlist.map((item) => (
                           <WatchlistItemCard key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
                        ))
                    ) : (
                       !isLoading && (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                            <p className="font-semibold text-lg">Your watchlist is empty.</p>
                            <p className="text-sm max-w-xs mx-auto">
                               Use the form above or add wallets and tokens directly from the Whale Feed.
                            </p>
                        </div>
                       )
                    )}
                </div>

                {!isPro && (
                  <div className="pt-8">
                    <AdCard />
                  </div>
                )}
            </div>
        </div>
  );
}

