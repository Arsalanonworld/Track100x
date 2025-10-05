
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { walletLeaderboard } from '@/lib/mock-data'
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { AuthDialog } from "../auth/auth-dialog";
import type { WatchlistItem } from "@/lib/types";

const TrackButton = ({ walletAddress }: { walletAddress: string }) => {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

    // Create a query to find if this wallet is already in the watchlist
    const watchlistQuery = useMemo(() => {
        if (!user || !firestore) return null;
        // This is a bit of a workaround since we don't have the doc ID.
        // A better structure might be to use the wallet address as the document ID.
        return query(collection(firestore, `users/${user.uid}/watchlist`), where("walletAddress", "==", walletAddress));
    }, [user, firestore, walletAddress]);

    // We use getDocs once to check, not real-time listening for this button.
    const [isTracking, setIsTracking] = useState(false);
    const [checking, setChecking] = useState(true);

    React.useEffect(() => {
        const checkIfTracked = async () => {
            if (watchlistQuery) {
                const querySnapshot = await getDocs(watchlistQuery);
                setIsTracking(!querySnapshot.empty);
            }
            setChecking(false);
        };
        checkIfTracked();
    }, [watchlistQuery]);


    const handleTrack = async () => {
        if (!user) {
            setAuthDialogOpen(true);
            return;
        }
        if (!firestore) return;

        setIsSubmitting(true);

        try {
            const watchlistCol = collection(firestore, `users/${user.uid}/watchlist`);
            await addDoc(watchlistCol, {
                walletAddress: walletAddress,
                createdAt: serverTimestamp(),
                userId: user.uid,
            });
            toast({
                title: "Wallet Added!",
                description: "You are now tracking this wallet on your watchlist.",
            });
            setIsTracking(true);
        } catch (error) {
            console.error("Error adding to watchlist: ", error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Could not add wallet to watchlist.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (checking || userLoading) {
        return <Button variant="outline" size="sm" disabled><Loader2 className="h-4 w-4 animate-spin"/></Button>
    }

    if (isTracking) {
        return <Button variant="outline" size="sm" disabled><Check className="h-4 w-4 mr-2"/> Tracking</Button>
    }

    return (
        <>
            <Button onClick={handleTrack} variant="outline" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
            </Button>
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
        </>
    )
}


export default function TopWalletsTab() {
    const topWallets = walletLeaderboard.slice(0, 10);

    return (
        <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Net Worth</TableHead>
                  <TableHead>P&L (7d)</TableHead>
                  <TableHead>Last Tx</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWallets.map((wallet) => (
                  <TableRow key={wallet.rank}>
                    <TableCell className="font-medium text-lg text-center">
                      #{wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(wallet.netWorth / 1_000_000).toFixed(2)}M
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-medium',
                        wallet.pnl > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {wallet.pnl > 0 ? '+' : ''}{wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      10m ago
                    </TableCell>
                    <TableCell className="text-right">
                      <TrackButton walletAddress={wallet.address} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
    )
}
