
'use client';
import { Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import React from 'react';

const features = [
  {
    category: "Core Features",
    items: [
      { name: "Live Whale Feed", free: "Delayed (1-2 mins)", pro: "Real-time" },
      { name: "Whale Feed Ads", free: true, pro: false },
      { name: "Leaderboard Access", free: "Top 10 Wallets", pro: "Top 100 Wallets" },
      { name: "Watchlist", free: "3 Wallets", pro: "Unlimited" },
      { name: "Insights & Articles", free: "Previews Only", pro: "Full Access" },
    ]
  },
  {
    category: "Alerts",
    items: [
      { name: "Quick Alerts", free: "1 Active Alert", pro: "Unlimited" },
      { name: "Advanced Alert Builder", free: false, pro: true },
      { name: "Delivery Channels", free: "In-App Only", pro: "In-App, Email, Telegram, Discord" },
    ]
  },
  {
    category: "Experience",
    items: [
      { name: "Advertisements", free: true, pro: false },
      { name: "Affiliate Links", free: true, pro: false },
      { name: "Priority Support", free: false, pro: true },
    ]
  }
];

const PricingCard = ({
    plan,
    price,
    pricePeriod,
    description,
    features,
    ctaText,
    ctaAction,
    highlight = false,
}: any) => (
    <Card className={cn('flex flex-col text-left', highlight && 'border-primary ring-2 ring-primary shadow-lg')}>
        <CardHeader>
            {highlight && (
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-2xl">{plan}</CardTitle>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Star className="h-5 w-5" />
                        Most Popular
                    </div>
                </div>
            )}
            {!highlight && <CardTitle className="font-headline text-2xl">{plan}</CardTitle>}
            
            <div className="flex items-baseline pt-4">
                <span className="text-4xl font-bold tracking-tight">{price}</span>
                {pricePeriod && <span className="ml-1 text-xl font-medium text-muted-foreground">{pricePeriod}</span>}
            </div>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
             <ul className="space-y-3">
                {features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            <Button className="w-full" size="lg" onClick={ctaAction} variant={highlight ? 'default' : 'outline'}>
                {ctaText}
            </Button>
        </CardFooter>
    </Card>
);


export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user, loading } = useUser();
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (!user) {
        router.push('/login');
    } else {
        router.push('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
        <section className="text-center max-w-3xl mx-auto">
             <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl font-headline">
                Unlock Your On-Chain Edge
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
                Go Pro to get unlimited real-time data, advanced alerts, and an ad-free experience. Stop guessing, start tracking.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
                <span className={cn("font-medium", billingCycle === 'monthly' && 'text-primary')}>Monthly</span>
                <Switch 
                    checked={billingCycle === 'yearly'}
                    onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span className={cn("font-medium", billingCycle === 'yearly' && 'text-primary')}>
                    Yearly <span className="text-green-500 font-bold ml-1">(Save 20%)</span>
                </span>
            </div>
        </section>
        
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            <PricingCard 
                plan="Free"
                price="$0"
                description="Get a feel for our platform with essential tracking tools."
                features={["Delayed Whale Feed", "Top 10 Leaderboard", "1 Active Alert", "Ad-supported"]}
                ctaText="Continue with Free"
                ctaAction={() => router.push('/')}
            />
             <PricingCard 
                plan="Pro"
                price={billingCycle === 'monthly' ? '$29' : '$23'}
                pricePeriod="/ month"
                description="Unlimited access to every tool for the serious on-chain analyst."
                features={["Real-time Whale Feed", "Full Leaderboard Access", "Unlimited Advanced Alerts", "Ad-Free Experience"]}
                ctaText="Upgrade to Pro"
                ctaAction={handleUpgradeClick}
                highlight
            />
        </section>

        <section className="mt-24">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                    Feature Comparison
                </h2>
                <p className="max-w-xl mx-auto mt-4 text-muted-foreground">
                    A detailed look at what separates our Free and Pro plans.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-card p-4 sm:p-8 rounded-2xl border">
                <div className="flow-root">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                             <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 px-3 text-left font-semibold">Feature</th>
                                    <th scope="col" className="py-3.5 px-3 text-center font-semibold w-40">Free</th>
                                    <th scope="col" className="py-3.5 px-3 text-center font-semibold w-40 rounded-t-lg bg-primary/10">
                                        <div className="flex items-center justify-center gap-2">
                                            <Star className="h-4 w-4 text-primary"/> Pro
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((category) => (
                                    <React.Fragment key={category.category}>
                                        <tr className="border-t">
                                            <th colSpan={3} scope="colgroup" className="py-2 px-3 text-left text-base font-semibold text-primary bg-muted/30">
                                                {category.category}
                                            </th>
                                        </tr>
                                         {category.items.map((item) => (
                                            <tr key={item.name} className="border-t">
                                                <td className="py-4 px-3 font-medium">{item.name}</td>
                                                <td className="py-4 px-3 text-center text-muted-foreground">
                                                    {typeof item.free === 'boolean' ? (
                                                        item.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />
                                                    ) : item.free}
                                                </td>
                                                <td className="py-4 px-3 text-center font-semibold bg-primary/5">
                                                    {typeof item.pro === 'boolean' ? (
                                                         item.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />
                                                    ) : item.pro}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
