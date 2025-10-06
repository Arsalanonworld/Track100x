
'use client';

import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { Loader2, Eye } from "lucide-react";
import { AuthDialog } from "./auth/auth-dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type WatchlistButtonProps = {
    identifier: string;
    type: 'wallet' | 'token';
}

export const WatchlistButton = ({ identifier, type }: WatchlistButtonProps) => {
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
        return query(collection(firestore, `users/${user.uid}/watchlist`), where("identifier", "==", identifier), where("type", "==", type));
    }, [user, firestore, identifier, type]);

    useEffect(() => {
        if (userLoading) return;
        if (!user) {
            setChecking(false);
            setIsTracking(false);
            return;
        }
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
    }, [watchlistQuery, userLoading, user]);

    const handleToggleTrack = async (e: React.MouseEvent) => {
        e.stopPropagation();
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
                    title: `${type === 'wallet' ? 'Wallet' : 'Token'} Unwatched`,
                    description: `This ${type} has been removed from your watchlist.`,
                });
                setIsTracking(false);
                setDocId(null);
            } catch (error) {
                console.error("Error removing from watchlist: ", error);
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: `Could not remove ${type} from watchlist.`,
                });
            }
        } else {
            // Track
            try {
                const watchlistCol = collection(firestore, `users/${user.uid}/watchlist`);
                const newDocRef = await addDoc(watchlistCol, {
                    identifier: identifier,
                    type: type,
                    createdAt: serverTimestamp(),
                    userId: user.uid,
                });
                toast({
                    title: `${type === 'wallet' ? 'Wallet' : 'Token'} Watched!`,
                    description: `You are now tracking this ${type} on your watchlist.`,
                });
                setIsTracking(true);
                setDocId(newDocRef.id);
            } catch (error) {
                console.error("Error adding to watchlist: ", error);
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: `Could not add ${type} to watchlist.`,
                });
            }
        }
        setIsSubmitting(false);
    }
    
    if (checking || userLoading) {
        return <Button variant="ghost" size="icon" disabled className="h-8 w-8"><Loader2 className="h-4 w-4 animate-spin"/></Button>
    }

    return (
        <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleToggleTrack} variant="ghost" size="icon" disabled={isSubmitting} className="h-8 w-8 shrink-0">
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Eye className={cn("h-4 w-4", isTracking ? "text-primary" : "text-muted-foreground")} />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent onClick={(e) => e.stopPropagation()}>
                  <p>{isTracking ? 'Remove from watchlist' : 'Add to watchlist'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
        </>
    )
}
