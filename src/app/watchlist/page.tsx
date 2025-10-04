
'use client';
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Loader2, Star, Zap } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransactionCard from '@/components/transaction-card';
import { mockWhaleTxs } from '@/lib/mock-data';
import { ProFeatureLock } from '@/components/pro-feature-lock';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { QuickAlertModal } from '@/components/quick-alert-modal';
import { useState } from 'react';
import { useAuthDialog } from '@/hooks/use-auth-dialog';

export default function WatchlistPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [selectedWallet, setSelectedWallet] = useState<string | undefined>(undefined);
    const { setAuthDialogOpen } = useAuthDialog();

    const watchlistRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/watchlist`);
    }, [user, firestore]);

    const { data: watchlist, isLoading: isWatchlistLoading } = useCollection(watchlistRef);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

    const isLoading = isUserLoading || isWatchlistLoading || isUserDataLoading;
    const isPro = userData?.plan === 'pro';

    const getWalletTransactions = (walletAddress: string) => {
        return mockWhaleTxs.filter(tx => tx.from === walletAddress || tx.to === walletAddress).slice(0, 5);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
         return (
             <div className="relative">
                 <PageHeader
                    title="Watchlist"
                    description="Track your favorite wallets and their latest activity."
                 />
                 <ProFeatureLock
                    title="Log In to View Your Watchlist"
                    description="Create a free account or log in to start following wallets."
                    buttonText="Log In / Sign Up"
                    onButtonClick={() => setAuthDialogOpen(true)}
                  />
             </div>
         );
    }


    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}>
            <PageHeader
                title="Watchlist"
                description="Track your favorite wallets and their latest activity."
            />

            <div className="space-y-8">
                {watchlist && watchlist.length > 0 ? (
                    watchlist.map((item: any) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                        <span>Wallet</span>
                                    </CardTitle>
                                    <CardDescription>
                                        <div className="text-sm text-muted-foreground mt-2">
                                            <Badge variant="secondary" className="font-mono">{item.id}</Badge>
                                        </div>
                                    </CardDescription>
                                </div>
                                 <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedWallet(item.id)}
                                    >
                                      <Zap className="h-4 w-4 mr-2" />
                                      Set New Alert
                                    </Button>
                                </DialogTrigger>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <h4 className="font-semibold text-muted-foreground text-sm">Recent Transactions:</h4>
                                {getWalletTransactions(item.id).length > 0 ? (
                                    getWalletTransactions(item.id).map(tx => (
                                        <TransactionCard key={tx.id} tx={tx} />
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No recent transactions found for this wallet.</p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-16 border-2 border-dashed rounded-lg">
                        <Star className="h-12 w-12 mb-4" />
                        <p className="font-semibold text-lg">Your watchlist is empty.</p>
                        <p className="text-sm">
                            Follow wallets from the{' '}
                            <a href="/leaderboard" className="text-primary hover:underline">Leaderboard</a> or{' '}
                            <a href="/" className="text-primary hover:underline">Whale Feed</a> to get started.
                        </p>
                    </div>
                )}
                 {!isPro && watchlist && watchlist.length > 0 && (
                     <ProFeatureLock
                        title="Follow Unlimited Wallets"
                        description="You've reached your limit of 1 followed wallet on the free plan. Upgrade to Pro to track unlimited wallets."
                      />
                 )}
            </div>
             <QuickAlertModal walletAddress={selectedWallet} />
        </Dialog>
    );
}



