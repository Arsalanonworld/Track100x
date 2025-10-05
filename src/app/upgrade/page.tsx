
'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
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
import { Zap, Bell, BarChart, Newspaper, Eye } from 'lucide-react';


// ----------------- Data -----------------
const features = [
  {
    category: 'Core Features',
    items: [
      { name: 'Live Whale Feed', free: 'Delayed (1-2 mins)', pro: 'Real-time' },
      { name: 'Whale Feed Ads', free: true, pro: false },
      { name: 'Leaderboard Access', free: 'Top 10 Wallets', pro: 'Top 100 Wallets' },
      { name: 'Watchlist', free: '3 Wallets', pro: 'Unlimited' },
      { name: 'Insights & Articles', free: 'Previews Only', pro: 'Full Access' },
    ],
  },
  {
    category: 'Alerts',
    items: [
      { name: 'Quick Alerts', free: '1 Active Alert', pro: 'Unlimited' },
      { name: 'Advanced Alert Builder', free: false, pro: true },
      {
        name: 'Delivery Channels',
        free: 'In-App Only',
        pro: 'In-App, Email, Telegram, Discord',
      },
    ],
  },
  {
    category: 'Experience',
    items: [
      { name: 'Advertisements', free: true, pro: false },
      { name: 'Affiliate Links', free: true, pro: false },
      { name: 'Priority Support', free: false, pro: true },
    ],
  },
];

const featureHighlights = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Real-Time Whale Feed',
        description: 'See whale moves instantly as they happen on-chain, with zero delays.',
    },
    {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: 'Unlimited Smart Alerts',
        description: 'Set advanced rules and get notified via Email, Telegram, or Discord.',
    },
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        title: 'Top 100 Leaderboard',
        description: 'Gain an edge by tracking the most profitable wallets in crypto.',
    },
    {
        icon: <Newspaper className="h-8 w-8 text-primary" />,
        title: 'Full Insights Access',
        description: 'Read exclusive, in-depth research and market analysis from our experts.',
    },
    {
        icon: <Eye className="h-8 w-8 text-primary" />,
        title: 'Ad-Free Experience',
        description: 'Enjoy a clean, focused interface with no distractions or affiliate links.',
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
      'Your alerts and watchlist items will not be deleted, but they will be deactivated if you exceed the Free plan limits (1 active alert, 3 watched wallets). You can re-activate them if you upgrade again or reduce your usage to fit within the limits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards. All payments are processed securely through our payment provider, Stripe.',
  },
  {
    question: 'How "real-time" is the data?',
    answer:
      'Our Pro plan offers a feed with near-zero latency, pulling data directly as transactions are confirmed on-chain. The Free plan feed has a delay of up to 1-2 minutes.',
  },
  {
    question: 'Do you offer a free trial for the Pro plan?',
    answer:
      'We do not offer a time-based free trial. However, our Free plan is a great way to experience the core functionality of Track100x. You can upgrade to Pro at any time to unlock all features.',
  },
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
}: {
  plan: string;
  price: string;
  pricePeriod?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  highlight?: boolean;
}) => (
  <Card
    className={cn(
      'flex flex-col text-left',
      highlight && 'border-primary ring-2 ring-primary shadow-lg'
    )}
  >
    <CardHeader>
      {highlight && (
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{plan}</CardTitle>
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Star className="h-5 w-5" />
            Most Popular
          </div>
        </div>
      )}
      {!highlight && <CardTitle className="text-2xl">{plan}</CardTitle>}

      <div className="flex items-baseline pt-4">
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        {pricePeriod && (
          <span className="ml-1 text-xl font-medium text-muted-foreground">{pricePeriod}</span>
        )}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ul className="space-y-3">
        {features.map((feature: any, index: number) => (
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
        onClick={ctaAction}
        variant={highlight ? 'default' : 'outline'}
      >
        {ctaText}
      </Button>
    </CardFooter>
  </Card>
);

const ProFeatures = () => {
    return (
        <section className="py-16 sm:py-24">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    An Unfair Advantage is Waiting
                </h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                    Here's what you unlock with a Pro membership.
                </p>
            </div>
            <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll-horizontal">
                    {[...featureHighlights, ...featureHighlights].map((feature, index) => (
                        <div key={index} className="flex-shrink-0 w-80 p-4">
                            <div className="bg-card border rounded-xl p-6 h-full flex flex-col items-center text-center">
                                <div className="flex-shrink-0">{feature.icon}</div>
                                <h3 className="text-lg font-bold mt-4 mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"></div>
                 <style jsx>{`
                    @keyframes scroll-horizontal {
                      from { transform: translateX(0); }
                      to { transform: translateX(-50%); }
                    }
                    .animate-scroll-horizontal {
                      animation: scroll-horizontal 40s linear infinite;
                    }
                `}</style>
            </div>
        </section>
    );
};


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
      router.push('/checkout');
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
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
            Follow the Whales. Find the Alpha.
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
            Get real-time data, unlimited alerts, and advanced tools. Upgrade to Track100x Pro.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => scrollTo('pricing')}>
              Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollTo('comparison')}>
              Compare Plans
            </Button>
          </div>
        </section>

        <ProFeatures />

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
              Yearly <span className="text-green-500 font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            <PricingCard
              plan="Free"
              price="$0"
              description="Get a feel for our platform with essential tracking tools."
              features={['Delayed Whale Feed', 'Top 10 Leaderboard', '1 Active Alert', 'Ad-supported']}
              ctaText={user ? 'Your Current Plan' : 'Get Started Free'}
              ctaAction={() => !user && router.push('/')}
            />
            <PricingCard
              plan="Pro"
              price={billingCycle === 'monthly' ? '$29' : '$23'}
              pricePeriod="/ month"
              description="Unlimited access to every tool for the serious on-chain analyst."
              features={[
                'Real-time Whale Feed',
                'Full Leaderboard Access',
                'Unlimited Advanced Alerts',
                'Ad-Free Experience',
              ]}
              ctaText="Upgrade to Pro"
              ctaAction={handleUpgradeClick}
              highlight
            />
          </div>
        </section>

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
