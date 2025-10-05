
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { AuthDialog } from "../auth/auth-dialog";


const mockTrending = [
    { rank: 1, address: '0x456...7890', volume: '10M', activity: 50 },
    { rank: 2, address: '0xabc...def0', volume: '8.5M', activity: 120 },
    { rank: 3, address: '0x1a2...b3c4', volume: '7.2M', activity: 88 },
];

const TrackButton = ({ walletAddress }: { walletAddress: string }) => {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [docId, setDocId] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);

    const watchlistQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/watchlist`), where("walletAddress", "==", walletAddress));
    }, [user, firestore, walletAddress]);

    useEffect(() => {
        if (userLoading) return;
        setChecking(true);
        const checkIfTracked = async () => {
            if (watchlistQuery) {
                try {
                    const querySnapshot = await getDocs(watchlistQuery);
                    if (!querySnapshot.empty) {
                        setIsTracking(true);
                        setDocId(querySnapshot.docs[0].id);
                    } else {
                        setIsTracking(false);
                        setDocId(null);
                    }
                } catch (error) {
                    console.error("Error checking watchlist:", error);
                    setIsTracking(false);
                    setDocId(null);
                }
            } else {
                setIsTracking(false);
                setDocId(null);
            }
            setChecking(false);
        };
        checkIfTracked();
    }, [watchlistQuery, userLoading]);

    const handleToggleTrack = async () => {
        if (!user) {
            setAuthDialogOpen(true);
            return;
        }
        if (!firestore) return;

        setIsSubmitting(true);

        if (isTracking && docId) {
            // Untrack
            try {
                const docRef = doc(firestore, `users/${user.uid}/watchlist`, docId);
                await deleteDoc(docRef);
                toast({
                    title: "Wallet Unwatched",
                    description: "This wallet has been removed from your watchlist.",
                });
                setIsTracking(false);
                setDocId(null);
            } catch (error) {
                console.error("Error removing from watchlist: ", error);
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Could not remove wallet from watchlist.",
                });
            }
        } else {
            // Track
            try {
                const watchlistCol = collection(firestore, `users/${user.uid}/watchlist`);
                const newDocRef = await addDoc(watchlistCol, {
                    walletAddress: walletAddress,
                    createdAt: serverTimestamp(),
                    userId: user.uid,
                });
                toast({
                    title: "Wallet Watched!",
                    description: "You are now tracking this wallet on your watchlist.",
                });
                setIsTracking(true);
                setDocId(newDocRef.id);
            } catch (error) {
                console.error("Error adding to watchlist: ", error);
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Could not add wallet to watchlist.",
                });
            }
        }
        setIsSubmitting(false);
    }
    
    if (checking || userLoading) {
        return <Button variant="ghost" size="icon" disabled><Loader2 className="h-4 w-4 animate-spin"/></Button>
    }

    return (
        <>
            <Button onClick={handleToggleTrack} variant="ghost" size="icon" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Star className={cn("h-4 w-4", isTracking ? "fill-primary text-primary" : "text-muted-foreground")} />
                )}
            </Button>
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
        </>
    )
}

export default function TrendingWalletsTab() {
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Volume (7d)</TableHead>
                      <TableHead>Activity (7d)</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTrending.map((wallet) => (
                      <TableRow key={wallet.rank}>
                        <TableCell className="font-medium text-lg text-center">
                          #{wallet.rank}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {wallet.address}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${wallet.volume}
                        </TableCell>
                        <TableCell>
                          {wallet.activity} txns
                        </TableCell>
                        <TableCell className="text-right">
                            <TrackButton walletAddress={wallet.address} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Support Us!</AlertTitle>
                <AlertDescription>
                   This feature is free. Support us by using our affiliate link to <a href="#" className="font-semibold underline">trade on Binance</a>.
                </AlertDescription>
            </Alert>
        </div>
    )
}
