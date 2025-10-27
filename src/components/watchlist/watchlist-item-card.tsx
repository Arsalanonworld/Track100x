
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, BellPlus, Pencil, Check, X, Wallet } from 'lucide-react';
import type { WatchlistItem } from '@/lib/types';
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
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoIcon } from '@/components/crypto-icon';
import { getExplorerUrl } from '@/lib/explorers';

export function WatchlistItemCard({ 
    item, 
    onUpdate, 
    onRemove,
    onAlertCreate
}: { 
    item: WatchlistItem, 
    onUpdate: (id: string, name: string) => void, 
    onRemove: (item: WatchlistItem) => void,
    onAlertCreate: (entity: { type: 'wallet' | 'token', identifier: string }) => void
}) {
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
    
    if (!item.identifier) return null;

    const currentToken = item.type === 'token' ? { name: item.identifier.toUpperCase() } : null;

    return (
        <Card className='group'>
            <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                    {/* Icon */}
                    <div className='mt-1'>
                        {item.type === 'wallet' ? <Wallet className="h-6 w-6 text-muted-foreground"/> : <CryptoIcon token={item.identifier} className="h-6 w-6"/>}
                    </div>

                    {/* Main Content */}
                    <div className='flex-1 space-y-1 min-w-0'>
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
                                <Link href={getExplorerUrl('ethereum', item.identifier, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-block truncate max-w-full'>
                                    {item.identifier}
                                </Link>
                            )}
                            </>
                       ) : (
                            <div>
                                <h3 className='text-lg font-semibold truncate'>
                                    {currentToken?.name || item.name || item.identifier}
                                </h3>
                                <p className="font-mono text-sm text-muted-foreground">{item.identifier.toUpperCase()}</p>
                            </div>
                       )}
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1'>
                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onAlertCreate({type: item.type, identifier: item.identifier})}>
                            <BellPlus className="h-4 w-4" />
                        </Button>
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
    )
}
