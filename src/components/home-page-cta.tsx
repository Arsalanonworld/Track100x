
'use client';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CreateAlertModal } from './create-alert-modal';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

export const HomePageCta = () => {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userData } = useDoc(userDocRef);

    const alertsRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, 'alerts');
    }, [firestore, user]);
    const { data: alerts } = useCollection(alertsRef);

    const isPro = userData?.plan === 'pro';
    const activeAlertCount = alerts?.length ?? 0;
    const freeAlertLimit = userData?.entitlements?.alerts?.maxActive ?? 3;
    const canCreateAlert = isPro || activeAlertCount < freeAlertLimit;

    return (
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold font-headline mb-2">Your Market Edge is One Alert Away.</h2>
            <p className="text-muted-foreground text-lg mb-6">Create a custom alert now and never miss a critical market move again.</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg">
                        Create a Free Alert
                        <ArrowRight className="ml-2" />
                    </Button>
                </DialogTrigger>
                {user && !isUserLoading ? (
                    <CreateAlertModal isPro={isPro} canCreateAlert={canCreateAlert} userId={user.uid} />
                ) : (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Sign Up to Create Alerts</DialogTitle>
                            <DialogDescription>
                                Create a free account to get started with up to {freeAlertLimit} custom alerts.
                            </DialogDescription>
                        </DialogHeader>
                        <Button className="w-full" asChild><a href="/auth/login">Login / Sign Up</a></Button>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};
