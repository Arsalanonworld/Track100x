
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'yearly';
  const { user } = useUser();

  const price = plan === 'monthly' ? 29 : 23;
  const planName = plan === 'monthly' ? 'Monthly' : 'Yearly';
  const billingCycle = plan === 'monthly' ? 'per month' : 'per year (billed annually)';
  const total = plan === 'monthly' ? 29.00 : 276.00;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8">
            <Button variant="ghost" asChild>
                <Link href="/upgrade">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side: Payment Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Complete your secure purchase. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user?.email || ''} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Information</Label>
                <div className="relative">
                    <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM / YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-on-card">Name on Card</Label>
                <Input id="name-on-card" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-background sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Track100x Pro - {planName}</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Billed {billingCycle}.
                  </p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={() => router.push('/confirmation')}>
                   <Lock className="mr-2 h-4 w-4" />
                   Pay Now
                </Button>
                 <p className="text-xs text-center text-muted-foreground">
                  This is a demo. No real payment will be processed.
                 </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm />
        </Suspense>
    )
}
