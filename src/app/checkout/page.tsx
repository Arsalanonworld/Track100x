
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>Complete your purchase to upgrade to Pro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between font-semibold">
                        <span>Tack100x Pro (Yearly)</span>
                        <span>$276.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Billed annually.</p>
                </div>
                {/* This is where a real checkout form from a provider like Stripe or LemonSqueezy would go */}
                <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Payment processor would be here</p>
                </div>

                 <Button className="w-full" onClick={() => router.push('/confirmation')}>
                    Confirm Purchase
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
