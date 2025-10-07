

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, BellPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { tokenLibrary } from '@/lib/tokens';

type WatchlistActionFormProps = {
    atLimit: boolean;
    onItemAdded: () => void;
    onAlertCreate: (entity: { type: 'wallet' | 'token'; identifier: string }) => void;
};

export function WatchlistActionForm({ atLimit, onItemAdded, onAlertCreate }: WatchlistActionFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<{ identifier: string; type: 'wallet' | 'token'; action: 'add' | 'alert' } | null>(null);

  const { user, firestore } = useUser();
  const { toast } = useToast();

  const isWalletAddress = (str: string) => /^0x[a-fA-F0-9]{40}$/.test(str);
  const isKnownToken = (str: string) => !!tokenLibrary[str.toUpperCase()];

  const handleAction = async (action: 'add' | 'alert') => {
    if (!identifier) return;

    if (atLimit && action === 'add') {
      toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
      return;
    }

    const trimmedIdentifier = identifier.trim();

    if (isWalletAddress(trimmedIdentifier)) {
      setItemToAdd({ identifier: trimmedIdentifier, type: 'wallet', action });
      setIsAliasModalOpen(true);
    } else if (isKnownToken(trimmedIdentifier)) {
      await confirmAndAddItem(trimmedIdentifier.toUpperCase(), 'token', '', action);
    } else {
      toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please enter a valid wallet address or a known token symbol.' });
    }
  };
  
  const confirmAndAddItem = async (id: string, type: 'wallet' | 'token', name: string, action: 'add' | 'alert') => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to add items.' });
        return;
    };
    setIsSubmitting(true);
    
    try {
      const q = query(collection(firestore, `users/${user.uid}/watchlist`), where("identifier", "==", id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newDoc: Omit<WatchlistItem, 'id' | 'createdAt'> & { createdAt: any } = {
            identifier: id,
            type: type,
            name: name,
            userId: user.uid,
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, `users/${user.uid}/watchlist`), newDoc);
        toast({ title: 'Item Added!', description: `${id} has been added to your watchlist.` });
        onItemAdded();
      }
      
      if (action === 'alert') {
        onAlertCreate({ type, identifier: id });
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
      confirmAndAddItem(itemToAdd.identifier, itemToAdd.type, alias, itemToAdd.action);
    }
  };

  return (
    <>
      <div className="flex items-center p-1.5 rounded-full border bg-card shadow-sm w-full">
            <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input 
                    id="add-item-input"
                    placeholder="Paste address or token symbol..."
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAction('add');
                    }}
                />
            </div>
            <div className="flex items-center gap-1">
                <Button onClick={() => handleAction('add')} disabled={atLimit || isSubmitting || !identifier} className="shrink-0 rounded-full h-10 px-4 sm:px-6" variant="outline">
                    <Plus className="h-4 w-4 sm:mr-2"/>
                    <span className="hidden sm:inline">Add to Watchlist</span>
                </Button>
                <Button onClick={() => handleAction('alert')} disabled={isSubmitting || !identifier} className="shrink-0 rounded-full h-10 px-4 sm:px-6">
                    <BellPlus className="h-4 w-4 sm:mr-2"/>
                    <span className="hidden sm:inline">Create Alert</span>
                </Button>
            </div>
        </div>
      <Dialog open={isAliasModalOpen} onOpenChange={setIsAliasModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet to Watchlist</DialogTitle>
            <DialogDescription>
              Optionally, you can add a recognizable alias for the wallet address <span className='font-mono bg-muted p-1 rounded-sm'>{itemToAdd?.identifier}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            <Label htmlFor="alias">Alias (Optional)</Label>
            <Input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="e.g., My Trading Wallet"/>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setIsAliasModalOpen(false)}>Cancel</Button>
            <Button onClick={handleWalletAliasSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
