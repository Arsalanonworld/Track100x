
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Wallet, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { tokenLibrary } from '@/lib/tokens';
import { Combobox } from '../ui/combobox';

const tokenOptions = Object.values(tokenLibrary).map(token => ({
    value: token.symbol,
    label: `${token.name} (${token.symbol})`
}));

export function AddItemForm({ atLimit, onAdd }: { atLimit: boolean; onAdd: () => void }) {
  const [walletIdentifier, setWalletIdentifier] = useState('');
  const [tokenIdentifier, setTokenIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<{ identifier: string; type: 'wallet' | 'token' } | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isWalletAddress = (str: string) => /^0x[a-fA-F0-9]{40}$/.test(str);

  const handleAddWalletClick = () => {
    if (!walletIdentifier) {
      toast({ variant: 'destructive', title: 'Wallet Address Required', description: 'Please enter a wallet address.' });
      return;
    }

    if (!isWalletAddress(walletIdentifier)) {
      toast({ variant: 'destructive', title: 'Invalid Wallet Address', description: 'Please enter a valid Ethereum wallet address.' });
      return;
    }

    if (atLimit) {
      toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
      return;
    }

    setItemToAdd({ identifier: walletIdentifier, type: 'wallet' });
    setIsAliasModalOpen(true);
  };
  
  const handleAddTokenClick = () => {
    if (!tokenIdentifier) {
        toast({ variant: 'destructive', title: 'Token Required', description: 'Please select a token to add.' });
        return;
    }

    if (atLimit) {
      toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
      return;
    }
    
    confirmAddItem(tokenIdentifier, 'token', '');
  }

  const confirmAddItem = async (id: string, type: 'wallet' | 'token', name: string) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    
    try {
      const q = query(collection(firestore, `users/${user.uid}/watchlist`), where("identifier", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({ variant: 'destructive', title: 'Already Watched', description: `${id} is already on your watchlist.` });
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
      setWalletIdentifier('');
      setTokenIdentifier('');
      setAlias('');
    }
  };

  const handleWalletAliasSubmit = () => {
    if (itemToAdd) {
      confirmAddItem(itemToAdd.identifier, itemToAdd.type, alias);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Add Wallet */}
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Wallet className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input 
                    id="wallet-input"
                    placeholder="Paste wallet address..."
                    value={walletIdentifier}
                    onChange={(e) => setWalletIdentifier(e.target.value)}
                    disabled={atLimit}
                    className="pl-9"
                />
            </div>
            <Button onClick={handleAddWalletClick} disabled={atLimit || !walletIdentifier} className="shrink-0">
                <Plus className="h-4 w-4 sm:mr-2"/>
                <span className="hidden sm:inline">Add</span>
            </Button>
        </div>
        {/* Add Token */}
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-10"/>
                <Combobox 
                    options={tokenOptions}
                    value={tokenIdentifier}
                    onChange={setTokenIdentifier}
                    placeholder="Search for a token..."
                    emptyMessage="No tokens found."
                />
            </div>
            <Button onClick={handleAddTokenClick} disabled={atLimit || !tokenIdentifier} className="shrink-0">
                <Plus className="h-4 w-4 sm:mr-2"/>
                <span className="hidden sm:inline">Add</span>
            </Button>
        </div>
      </div>
      <Dialog open={isAliasModalOpen} onOpenChange={setIsAliasModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet to Watchlist</DialogTitle>
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
            <Button onClick={handleWalletAliasSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
