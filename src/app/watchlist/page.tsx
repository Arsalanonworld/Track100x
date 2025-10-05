
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, EyeOff } from 'lucide-react';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
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


// Mock data for display purposes
const mockWatchlist = [
  { id: '1', walletAddress: '0x1234567890abcdef1234567890abcdef12345678', createdAt: { toDate: () => new Date() } },
  { id: '2', walletAddress: 'So11111111111111111111111111111111111111112', createdAt: { toDate: () => new Date(Date.now() - 86400000) } },
  { id: '3', walletAddress: '0xab12cd34ef56ab12cd34ef56ab12cd34ef56ab12', createdAt: { toDate: () => new Date(Date.now() - 172800000) } },
];


function WatchlistSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <Skeleton className="h-6 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            ))}
        </div>
    )
}

export default function WatchlistPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
//   const watchlistQuery = user && firestore ? query(collection(firestore, `users/${user.uid}/watchlist`)) : null;
//   const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const { toast } = useToast();

  const watchlist = mockWatchlist;
  const watchlistLoading = false;

  const handleRemove = (item: WatchlistItem) => {
    // This would be firestore.deleteDoc(doc(firestore, `path`));
    toast({
        title: "Wallet Removed",
        description: `${item.walletAddress.slice(0, 6)}...${item.walletAddress.slice(-4)} removed from watchlist.`
    })
  }

  if (userLoading || watchlistLoading) {
    return (
        <div>
            <PageHeader
                title="Watchlist"
                description="Monitor the wallets you are tracking."
            />
            <WatchlistSkeleton />
        </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className='space-y-4'>
            <EyeOff className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className='text-xl font-semibold'>Login to View Your Watchlist</h3>
            <p className="text-muted-foreground">You need to be logged in to manage your watchlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Watchlist"
        description="Monitor the wallets you are tracking."
      />

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
                                {item.createdAt.toDate().toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
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
                                        This will permanently remove the wallet <span className='font-mono bg-muted p-1 rounded-sm'>{item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}</span> from your watchlist.
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
                        Add wallets from the leaderboard to start tracking.
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

