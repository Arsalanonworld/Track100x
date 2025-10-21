
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { CheckCircle, Star, User } from 'lucide-react';
import Link from 'next/link';
import { pricing } from '@/lib/app-data';

export function PricingPreview() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { user, claims } = useUser();
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/upgrade');
    }
  };

  const isPro = claims?.plan === 'pro';

  return (
    <div className="space-y-12">
        <div className="flex items-center justify-center gap-4">
            <span className={cn('font-medium', billingCycle === 'monthly' && 'text-primary')}>
            Monthly
            </span>
            <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={checked => setBillingCycle(checked ? 'yearly' : 'monthly')}
            aria-label="Toggle billing cycle"
            />
            <span className={cn('font-medium', billingCycle === 'yearly' && 'text-primary')}>
            Yearly <span className="text-green-500 font-bold ml-1">(Save over 25%)</span>
            </span>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {/* Free Plan Card */}
            <Card className={'flex flex-col text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'}>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><User className="h-6 w-6 text-muted-foreground"/>{pricing.free.name}</CardTitle>
                    <div className="flex items-baseline pt-4">
                    <span className="text-4xl font-bold tracking-tight">{pricing.free.price}</span>
                    </div>
                    <CardDescription>{pricing.free.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ul className="space-y-3">
                        {pricing.free.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push('/login')}
                    variant={'outline'}
                    disabled={!!user}
                    >
                    {user ? 'Your Current Plan' : 'Get Started Free'}
                    </Button>
                </CardFooter>
            </Card>
            
            {/* Pro Plan Card */}
            <Card className={'flex flex-col text-left border-primary ring-2 ring-primary shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20'}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl flex items-center gap-2"><Star className="h-6 w-6 text-primary"/>{pricing.pro.name}</CardTitle>
                    </div>
                    <div className="flex items-baseline pt-4">
                    <span className="text-4xl font-bold tracking-tight">{billingCycle === 'monthly' ? pricing.pro.priceMonthly : pricing.pro.priceYearly}</span>
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/ month</span>
                    </div>
                    <CardDescription>{pricing.pro.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ul className="space-y-3">
                        {pricing.pro.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button
                    className="w-full"
                    size="lg"
                    onClick={handleUpgradeClick}
                    disabled={isPro}
                    >
                    {isPro ? 'Your Current Plan' : 'Upgrade to Pro'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="text-center">
            <Button asChild variant="link">
                <Link href="/upgrade">
                    Compare All Features
                </Link>
            </Button>
        </div>
    </div>
  );
}
