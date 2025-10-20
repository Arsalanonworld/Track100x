
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Eye, BellPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { tokenLibrary } from '@/lib/tokens';
import type { User } from 'firebase/auth';
import { Card, CardContent } from '../ui/card';


type WatchlistActionFormProps = {
    user: User | null;
    onItemAdded: (entity: { type: 'wallet' | 'token'; identifier: string }) => void;
    atLimit: boolean;
    isLoading: boolean;
};

export function WatchlistActionForm({ user, onItemAdded, atLimit, isLoading }: WatchlistActionFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<{ identifier: string; type: 'wallet' | 'token'; } | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  const isWalletAddress = (str: string) => /^0x[a-fA-F0-9]{40}$/.test(str);
  const isKnownToken = (str: string) => !!tokenLibrary[str.toUpperCase()];

  const handleAddItem = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to add items to your watchlist.',
      });
      return;
    }
    if (!identifier) return;

    if (atLimit) {
      toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
      return;
    }

    const trimmedIdentifier = identifier.trim();

    if (isWalletAddress(trimmedIdentifier)) {
      setItemToAdd({ identifier: trimmedIdentifier, type: 'wallet' });
      setIsAliasModalOpen(true);
    } else if (isKnownToken(trimmedIdentifier.toUpperCase())) {
      await confirmAndAddItem(trimmedIdentifier.toUpperCase(), 'token', '');
    } else {
      toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please enter a valid wallet address or a known token symbol.' });
    }
  };
  
  const confirmAndAddItem = async (id: string, type: 'wallet' | 'token', name: string) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to add items.' });
        return;
    };
    setIsSubmitting(true);
    
    try {
      const q = query(collection(firestore, `users/${user.uid}/watchlist`), where("identifier", "==", id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        if (atLimit) {
            toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
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
        onItemAdded({ identifier: id, type });
      } else {
          toast({ title: 'Already Watched', description: `${id} is already in your watchlist.` });
      }
      
    } catch (error) {
      console.error("Error in watchlist action:", error);
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
      setItemToAdd(null);
    }
  };

  const handleWalletAliasSubmit = () => {
    if (itemToAdd) {
      confirmAndAddItem(itemToAdd.identifier, itemToAdd.type, alias);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <>
      <Card>
        <CardContent className="p-4">
            <h3 className='font-semibold mb-2'>Add to Watchlist</h3>
            <div className="flex items-center p-1.5 rounded-lg border bg-background shadow-sm w-full">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                    <Input 
                        id="add-item-input"
                        placeholder="Paste wallet address or token symbol..."
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isFormDisabled}
                        className="pl-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddItem();
                        }}
                    />
                </div>
                <Button 
                    onClick={handleAddItem}
                    disabled={isFormDisabled || !identifier || atLimit} 
                    className="shrink-0 rounded-md h-9 px-4 sm:px-6"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>
        </CardContent>
      </Card>
      <Dialog open={isAliasModalOpen} onOpenChange={setIsAliasModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet Alias</DialogTitle>
            <DialogDescription>
              You're adding{' '}
              <span className='font-mono bg-muted p-1 rounded-sm text-xs'>
                {itemToAdd?.identifier}
              </span>
              . Give it a memorable name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            <Label htmlFor="alias">Alias (Optional)</Label>
            <Input 
                id="alias" 
                value={alias} 
                onChange={(e) => setAlias(e.target.value)} 
                placeholder="e.g., My Trading Wallet"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleWalletAliasSubmit();
                }}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setIsAliasModalOpen(false)}>Cancel</Button>
            <Button onClick={handleWalletAliasSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add to Watchlist'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
