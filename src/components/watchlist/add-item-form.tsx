
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

export function AddItemForm({ atLimit, onItemConfirm }: { atLimit: boolean; onItemConfirm: (entity: {identifier: string, type: 'wallet' | 'token'}) => void }) {
  const [identifier, setIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<{ identifier: string; type: 'wallet' | 'token' } | null>(null);

  const { user, firestore } = useUser();
  const { toast } = useToast();

  const isWalletAddress = (str: string) => /^0x[a-fA-F0-9]{40}$/.test(str);
  const isKnownToken = (str: string) => !!tokenLibrary[str.toUpperCase()];

  const handleCreateAlertClick = () => {
    if (!identifier) {
      // If no identifier, just open the generic alert editor
      onItemConfirm({identifier: '', type: 'wallet'});
      return;
    }

    if (atLimit) {
      toast({ variant: 'destructive', title: 'Watchlist Limit Reached', description: 'Please upgrade to add more items.' });
      return;
    }

    const trimmedIdentifier = identifier.trim();

    if (isWalletAddress(trimmedIdentifier)) {
      setItemToAdd({ identifier: trimmedIdentifier, type: 'wallet' });
      setIsAliasModalOpen(true); // Ask for alias before proceeding
    } else if (isKnownToken(trimmedIdentifier)) {
      confirmAndOpenAlert(trimmedIdentifier.toUpperCase(), 'token', '');
    } else {
      // Not a valid address or known token, open generic alert creator
      onItemConfirm({identifier: '', type: 'wallet'});
    }
  };
  
  const confirmAndOpenAlert = async (id: string, type: 'wallet' | 'token', name: string) => {
    if (!user || !firestore) {
        onItemConfirm({ identifier: id, type: type });
        return;
    };
    setIsSubmitting(true);
    
    try {
      // Check if already on watchlist
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
      }
      
      // Proceed to open alert editor
      onItemConfirm({ identifier: id, type: type });

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
  };

  const handleWalletAliasSubmit = () => {
    if (itemToAdd) {
      confirmAndOpenAlert(itemToAdd.identifier, itemToAdd.type, alias);
    }
  };

  return (
    <>
      <div className="flex flex-1 items-center">
            <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input 
                    id="add-item-input"
                    placeholder="Paste address or token to create alert..."
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={atLimit}
                    className="pl-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateAlertClick();
                    }}
                />
            </div>
            <Button onClick={handleCreateAlertClick} disabled={atLimit} className="shrink-0 rounded-full h-10 px-4 sm:px-6">
                <BellPlus className="h-4 w-4 sm:mr-2"/>
                <span className="hidden sm:inline">Create Alert</span>
            </Button>
        </div>
      <Dialog open={isAliasModalOpen} onOpenChange={setIsAliasModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet to Watchlist</DialogTitle>
            <DialogDescription>
              This wallet will be added to your watchlist. Optionally, add an alias for <span className='font-mono bg-muted p-1 rounded-sm'>{itemToAdd?.identifier}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="alias">Alias</Label>
            <Input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="e.g., My Trading Wallet"/>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
                if(itemToAdd) onItemConfirm(itemToAdd);
                setIsAliasModalOpen(false);
            }}>Skip</Button>
            <Button onClick={handleWalletAliasSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Save & Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    