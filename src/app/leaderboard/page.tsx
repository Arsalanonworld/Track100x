
'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { walletLeaderboard } from '@/lib/mock-data';
import { ArrowUpDown, Zap, Star, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { QuickAlertModal } from '@/components/quick-alert-modal';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp, collection } from 'firebase/firestore';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';

export default function LeaderboardPage() {
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>(undefined);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { setAuthDialogOpen } = useAuthDialog();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const watchlistRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/watchlist`);
  }, [user, firestore]);
  const { data: watchlist, isLoading: isWatchlistLoading } = useCollection(watchlistRef);

  const isPro = userData?.plan === 'pro';
  const isLoading = isUserLoading || isUserDataLoading || isWatchlistLoading;

  // Guest: 5, Free: 10, Pro: All
  const topN = useMemo(() => {
    if (isPro) return walletLeaderboard.length;
    if (user) return userData?.entitlements?.leaderboard?.topN || 10;
    return 5; // Guest limit
  }, [isPro, user, userData]);
  
  const leaderboardData = useMemo(() => walletLeaderboard.slice(0, topN), [topN]);
  const showProLock = !isPro && walletLeaderboard.length > topN;


  const followedAddresses = React.useMemo(() => {
    return new Set(watchlist?.map((item: any) => item.id));
  }, [watchlist]);


  const handleFollowToggle = async (walletAddress: string) => {
    if (!user || !firestore) {
      setAuthDialogOpen(true);
      return;
    }

    const isFollowing = followedAddresses.has(walletAddress);
    const watchlistItemRef = doc(firestore, `users/${user.uid}/watchlist`, walletAddress);

    if (isFollowing) {
      try {
        await deleteDoc(watchlistItemRef);
        toast({ title: "Wallet unfollowed." });
      } catch (error) {
        console.error("Error unfollowing wallet:", error);
        toast({ title: "Could not unfollow wallet.", variant: "destructive" });
      }
    } else {
      if (!isPro && followedAddresses.size >= 3) {
        toast({
          title: "Free Limit Reached",
          description: "Upgrade to Pro to follow more than 3 wallets.",
          variant: "destructive",
        });
        return;
      }
      try {
        await setDoc(watchlistItemRef, {
          walletAddress,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Wallet followed!" });
      } catch (error) {
        console.error("Error following wallet:", error);
        toast({ title: "Could not follow wallet.", variant: "destructive" });
      }
    }
  };


  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}>
      <PageHeader
        title="Wallet Leaderboard"
        description="Discover and track the most profitable and active wallets in real-time."
      />

      <Card>
        {isLoading && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        )}
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle>Top Wallets</CardTitle>
              <CardDescription>
                {isPro ? "The biggest players in the crypto space." : `Showing the top ${topN} wallets.`}
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>
                     <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="-ml-4" disabled={!isPro}>
                              Net Worth
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                           </TooltipTrigger>
                           {!isPro && <TooltipContent>Sorting is a Pro feature.</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead>Top Holding</TableHead>
                  <TableHead>
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="-ml-4" disabled={!isPro}>
                               P&L (7d)
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                           </TooltipTrigger>
                           {!isPro && <TooltipContent>Sorting is a Pro feature.</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center">7d Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((wallet) => (
                  <TableRow key={wallet.rank} className="hover:shadow-md">
                    <TableCell className="font-medium text-lg text-center">
                      {wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 6)}...
                        {wallet.address.slice(-4)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(wallet.netWorth / 1_000_000).toFixed(2)}M
                    </TableCell>
                    <TableCell>
                      {wallet.topHolding ? (
                        <span>
                          {wallet.topHolding.token} ({wallet.topHolding.percentage}%)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-medium',
                        wallet.pnl > 0 ? 'text-green-600' : 'text-red-600',
                        'dark:text-green-500 dark:text-red-500'
                      )}
                    >
                      {wallet.pnl >= 0 ? '+' : '-'}
                      {wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-center">
                      {wallet.activity} txns
                    </TableCell>
                    <TableCell className="text-right">
                       <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleFollowToggle(wallet.address)}
                                  disabled={isLoading || (!user && !isUserLoading)}
                                >
                                  <Star className={cn("h-4 w-4", followedAddresses.has(wallet.address) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                                  <span className="sr-only">Follow wallet</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{followedAddresses.has(wallet.address) ? "Unfollow" : "Follow"} wallet</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                              if (!user) {
                                  setAuthDialogOpen(true);
                                  return;
                              }
                              setSelectedWallet(wallet.address);
                          }}
                        >
                          <Zap className="h-4 w-4" />
                          <span className="sr-only">Create Quick Alert</span>
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
                 {showProLock && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                         <div className="p-4 text-center bg-muted/50">
                            <h3 className="font-semibold">Unlock the rest of the Top 100 whales</h3>
                            <p className="text-muted-foreground text-sm mb-4">Upgrade to Pro to get full access to the leaderboard and advanced analytics.</p>
                            <AnimatedButton asChild>
                               <Link href="/upgrade">
                                  Upgrade to Pro
                                  <ArrowRight className="ml-2 h-4 w-4" />
                               </Link>
                            </AnimatedButton>
                          </div>
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <QuickAlertModal walletAddress={selectedWallet} />
    </Dialog>
  );
}
