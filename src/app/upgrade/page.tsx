
'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { Bell, Eye, Wallet } from 'lucide-react';


// ----------------- Data -----------------
const features = [
  {
    category: 'Core Features',
    items: [
      { name: 'Real-Time Whale Feed', free: true, pro: true },
      { name: 'Leaderboard Access', free: true, pro: true },
      { name: 'Watchlist', free: '5 items', pro: 'Unlimited' },
    ],
  },
  {
    category: 'Alerts',
    items: [
      { name: 'Quick Alerts', free: '5 active', pro: 'Unlimited' },
      { name: 'Advanced Alert Builder', free: false, pro: true },
    ],
  },
   {
    category: 'Portfolio & Analytics',
    items: [
        { name: 'Link Wallets', free: '1 wallet', pro: 'Unlimited' },
        { name: 'Historical Performance', free: '7-day history', pro: 'Full history' },
    ]
   },
  {
    category: 'Experience',
    items: [
      { name: 'Priority Support', free: false, pro: true },
    ],
  },
];

const featureHighlights = [
    {
        icon: <Zap />,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: <Eye />,
        title: 'Unlimited Watchlist',
        description: 'Track as many wallets and tokens as you want, without any limitations.',
    },
    {
        icon: <Wallet />,
        title: 'Full Portfolio Analytics',
        description: 'Link all your wallets and unlock complete historical data and performance insights.',
    },
     {
        icon: <Bell />,
        title: 'Unlimited Alerts',
        description: 'Create unlimited quick and advanced alerts so you never miss an important on-chain move.',
    },
];

const faqs = [
  {
    question: 'Can I cancel my Pro subscription at any time?',
    answer:
      'Yes, you can cancel your subscription at any time from your account page. You will retain Pro access until the end of your current billing period.',
  },
  {
    question: 'What happens to my data and alerts if I downgrade to Free?',
    answer:
      'Your alerts and watchlist items will not be deleted, but they will be deactivated if you exceed the Free plan limits (5 alerts, 5 watched items). You can re-activate them if you upgrade again or reduce your usage to fit within the limits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards. All payments are processed securely through our payment provider, Stripe.',
  },
];

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { user, loading, claims } = useUser();
  const router = useRouter();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const isPro = claims?.plan === 'pro';

  React.useEffect(() => {
    // If user is already pro, redirect them to account page
    if (!loading && isPro) {
      router.push('/account');
    }
  }, [user, loading, isPro, router]);

  const handleUpgradeClick = () => {
    if (!user) {
      setAuthDialogOpen(true);
    } else {
      // This is where you would redirect to a checkout page.
      // For this example, we'll just show an alert.
      alert(`Redirecting to checkout for ${billingCycle} plan...`);
      // In a real app: router.push(`/checkout?plan=${billingCycle}`);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || isPro) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {/* You can add a loading spinner here */}
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
            Unlock Your Full On-Chain Potential
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
            Go beyond the basics. Get unlimited alerts, access the advanced builder, and track your entire portfolio with full historical data.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg" onClick={handleUpgradeClick}>
              Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollTo('comparison')}>
              Compare Plans
            </Button>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-16 sm:py-24">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A New Standard in Wallet Analysis</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Go beyond simple balance checks. We provide institutional-grade tools to give you an edge.
            </p>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {featureHighlights.map((feature, index) => (
                <div key={index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                     <Card className="relative flex flex-col items-center text-center p-6 bg-card/95 h-full">
                        <CardHeader className="p-0 items-center">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                {React.cloneElement(feature.icon as React.ReactElement, { className: 'h-6 w-6 text-primary' })}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                </div>
              ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Simple, Clear Pricing
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-muted-foreground">
              Choose the plan that fits your strategy.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
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
             <Card className={'flex flex-col text-left'}>
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                   <div className="flex items-baseline pt-4">
                    <span className="text-4xl font-bold tracking-tight">$0</span>
                  </div>
                  <CardDescription>Get a feel for our platform with essential tracking tools.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                      {['Real-time Whale Feed', '5 Watchlist Items', '5 Active Alerts', '1 Linked Wallet'].map((feature, index) => (
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
                    onClick={() => !user && setAuthDialogOpen(true)}
                    variant={'outline'}
                    disabled={!!user}
                  >
                    {user ? 'Your Current Plan' : 'Get Started Free'}
                  </Button>
                </CardFooter>
            </Card>
            
             {/* Pro Plan Card */}
            <Card className={'flex flex-col text-left border-primary ring-2 ring-primary shadow-lg'}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Pro</CardTitle>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Star className="h-5 w-5" />
                      Most Popular
                    </div>
                  </div>
                  <div className="flex items-baseline pt-4">
                    <span className="text-4xl font-bold tracking-tight">{billingCycle === 'monthly' ? '$7' : '$6'}</span>
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/ month</span>
                  </div>
                  <CardDescription>Unlimited access to every tool for the serious on-chain analyst.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                   <ul className="space-y-3">
                      {['Unlimited Watchlist', 'Unlimited Alerts & Advanced Builder', 'Unlimited Linked Wallets', 'Full Portfolio History & Analytics'].map((feature, index) => (
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
                  >
                    Upgrade to Pro
                  </Button>
                </CardFooter>
            </Card>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section id="comparison" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
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
                      <th scope="col" className="py-3.5 px-3 text-left font-semibold">
                        Feature
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center font-semibold w-40">
                        Free
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-center font-semibold w-40 rounded-t-lg bg-primary/10"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-4 w-4 text-primary" /> Pro
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map(category => (
                      <React.Fragment key={category.category}>
                        <tr className="border-t">
                          <th
                            colSpan={3}
                            scope="colgroup"
                            className="py-2 px-3 text-left text-base font-semibold text-primary bg-muted/30"
                          >
                            {category.category}
                          </th>
                        </tr>
                        {category.items.map(item => (
                          <tr key={item.name} className="border-t">
                            <td className="py-4 px-3 font-medium">{item.name}</td>
                            <td className="py-4 px-3 text-center text-muted-foreground">
                              {typeof item.free === 'boolean' ? (
                                item.free ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                )
                              ) : (
                                item.free
                              )}
                            </td>
                            <td className="py-4 px-3 text-center font-semibold bg-primary/5">
                              {typeof item.pro === 'boolean' ? (
                                item.pro ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                )
                              ) : (
                                item.pro
                              )}
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
        
        {/* FAQ Section */}
        <section id="faq" className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-left">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
