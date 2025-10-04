
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { doc, setDoc } from 'firebase/firestore';

export default function CheckoutPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = searchParams.get('plan') || 'monthly';

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const planDetails = useMemo(() => {
    if (plan === 'yearly') {
        return {
            name: 'Tack100x Pro Plan (Yearly)',
            price: 290.00,
            priceString: '$290.00'
        }
    }
    return {
        name: 'Tack100x Pro Plan (Monthly)',
        price: 29.00,
        priceString: '$29.00'
    }
  }, [plan]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login?next=/upgrade');
    }
  }, [user, isUserLoading, router]);

  const handleConfirmPayment = async () => {
    if (!userDocRef) return;
    setIsProcessing(true);
    try {
        // This is a mock payment confirmation.
        // In a real app, this would involve Stripe or another payment provider.
        await setDoc(userDocRef, { plan: 'pro' }, { merge: true });
        toast({
            title: 'Upgrade Successful!',
            description: 'Welcome to Tack100x Pro.',
        });
        router.push('/confirmation');
    } catch (error: any) {
         toast({
            title: 'Upgrade Failed',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsProcessing(false);
    }
  };
  
  if (isUserLoading || !user) {
    return (
       <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-4 order-2 md:order-1">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center font-semibold">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-primary" />
                                <span>{planDetails.name}</span>
                            </div>
                            <span>{planDetails.priceString}</span>
                        </div>
                         <Separator />
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{planDetails.priceString}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>$0.00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>{planDetails.priceString}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6 order-1 md:order-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Checkout</CardTitle>
                        <CardDescription>Securely complete your upgrade to Tack100x Pro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Information</Label>
                            <div className="relative">
                                <Input id="card-number" placeholder="Card Number" />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Input placeholder="MM / YY" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="CVC" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name on Card</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={handleConfirmPayment} disabled={isProcessing}>
                             {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                             ) : (
                                `Pay ${planDetails.priceString}`
                             )}
                        </Button>
                    </CardFooter>
                </Card>
                 <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Lock className="h-3 w-3" /> Secure payment processing by Stripe.
                </p>
            </div>
        </div>
    </div>
  );
}
