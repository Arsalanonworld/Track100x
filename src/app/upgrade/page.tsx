
'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Star, ArrowRight, TrendingUp, Bell, Zap, Trophy, ShieldQuestion, BrainCircuit, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';


const features = [
  { name: 'Live Whale Feed', free: '15 min delay', pro: 'Real-time (0-delay)' },
  { name: 'Leaderboard Access', free: 'Top 10 Wallets', pro: 'Top 100 + History' },
  { name: 'Alerts', free: '3 Active Alerts', pro: 'Unlimited Alerts' },
  { name: 'Advanced Alert Builder', free: false, pro: true },
  { name: 'Premium Insights & Research', free: false, pro: true },
  { name: 'AI-Curated News Feed', free: false, pro: true },
  { name: 'Multi-Channel Notifications', free: 'Email only', pro: 'Email, Telegram, Discord' },
  { name: 'Data Export (CSV)', free: false, pro: true },
];

const proFeatures = [
    {
        icon: <TrendingUp className="h-6 w-6 text-primary" />,
        title: "Real-Time Data Edge",
        description: "Get an instant advantage with a zero-delay whale feed. See transactions as they happen, not minutes later."
    },
    {
        icon: <Trophy className="h-6 w-6 text-primary" />,
        title: "Full Whale Leaderboard",
        description: "Unlock the top 100 whale wallets, analyze their PnL and full history, and copy-trade the market's most profitable players."
    },
    {
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: "Unlimited, Advanced Alerts",
        description: "Go beyond simple alerts. Use our multi-condition builder to create complex rules and receive them instantly via Telegram or Discord."
    },
    {
        icon: <BrainCircuit className="h-6 w-6 text-primary" />,
        title: "AI-Powered Insights",
        description: "Leverage our AI to curate news, analyze market sentiment, and uncover narratives before they become mainstream."
    }
];

const faqs = [
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your Pro subscription at any time from your account page. You will retain access to Pro features until the end of your current billing period."
    },
    {
        question: "What happens after I upgrade?",
        answer: "Once you upgrade, all Pro features will be unlocked for your account immediately. You can start creating unlimited advanced alerts, view the full leaderboard, and access all premium insights."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. All payments are securely processed."
    },
    {
        question: "Is there a free trial for the Pro plan?",
        answer: "We currently do not offer a free trial, but you can use the Free plan for as long as you like to get a feel for our platform's basic features."
    }
]

export default function UpgradePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    
    const isPro = userData?.plan === 'pro';
    const isLoading = isUserLoading || isUserDataLoading;

    const handleUpgradeClick = () => {
        if (!user) {
            router.push('/auth/login?next=/upgrade');
        } else {
            router.push(`/checkout?plan=${billingCycle}`);
        }
    }
    
  
  return (
    <div className="bg-background text-foreground -mt-8 -mx-8">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 text-center relative overflow-hidden">
        <div 
            className="absolute inset-0 bg-center bg-no-repeat [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"
            style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.1), transparent 50%)',
            }}
        />
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl font-headline">
            Don't Follow the News. <br className="sm:hidden" /> Follow the Money.
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
            Stop reacting to old news. WhaleWatch100x Pro gives you the real-time on-chain data and advanced tools you need to anticipate market moves before they happen.
          </p>
          <div className="mt-8">
            <Button size="lg" className="group relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40" onClick={handleUpgradeClick}>
              <span className="absolute inset-[-1000%] animate-[shimmer_4s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff15_0%,#ffffff30_50%,#ffffff15_100%)]" />
              <span className="relative z-10 flex items-center">
                  Upgrade to Pro Now <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
       <section className="py-8">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trusted by top traders & analysts</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
                    <div className="flex items-center gap-2"><Users className="h-5 w-5" /><span className="font-semibold text-xs">CRYPTO FUNDS</span></div>
                    <div className="flex items-center gap-2"><BrainCircuit className="h-5 w-5" /><span className="font-semibold text-xs">DEGEN TRADERS</span></div>
                    <div className="flex items-center gap-2"><Trophy className="h-5 w-5" /><span className="font-semibold text-xs">ALPHA HUNTERS</span></div>
                </div>
            </div>
        </section>

      {/* Pro Features */}
       <section className="py-16 sm:py-24 bg-muted/50 border-y">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        An Unfair Advantage is Waiting
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                        Here's what you unlock with a Pro membership.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {proFeatures.map((feature) => (
                        <div key={feature.title} className="text-center p-4 rounded-lg hover:bg-background transition-colors">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-headline">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
       </section>

      {/* Pricing Cards Section */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Get Your Edge
                </h2>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
                Choose the plan that's right for you. Cancel anytime.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
                    <Switch 
                        id="billing-cycle"
                        checked={billingCycle === 'yearly'}
                        onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                    />
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>Yearly</Label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Save 15%</Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="flex flex-col transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Free</CardTitle>
                    <CardDescription>For casual observers getting started with on-chain analysis.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <p className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    <ul className="space-y-3 text-sm">
                        {features.map(feature => (
                            <li key={feature.name} className="flex items-start gap-3">
                                {typeof feature.free === 'boolean' ? (
                                    feature.free ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                ) : <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />}
                                <div>
                                <span className={cn(!feature.free && "text-muted-foreground line-through")}>{feature.name}</span>
                                <p className="text-muted-foreground">{typeof feature.free === 'boolean' ? (feature.free ? 'Included' : 'Not Included') : feature.free}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" className="w-full" disabled={user && !isPro}>
                         <Link href={!user ? "/auth/signup" : "#"}>
                            {user && !isPro ? 'Your Current Plan' : 'Get Started'}
                         </Link>
                    </Button>
                </CardFooter>
                </Card>
                
                {/* Pro Plan */}
                <Card className={cn("flex flex-col border-primary shadow-lg shadow-primary/20 relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1")}>
                <div className="absolute top-0 right-4 -mt-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold leading-tight text-primary-foreground">
                        <Star className="h-4 w-4"/>
                        Most Popular
                    </div>
                    </div>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Pro</CardTitle>
                    <CardDescription>For serious traders who need a real-time market edge.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    {billingCycle === 'monthly' ? (
                        <p className="text-4xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    ) : (
                         <p className="text-4xl font-bold">$490<span className="text-lg font-normal text-muted-foreground">/year</span></p>
                    )}
                    <ul className="space-y-3 text-sm">
                        {features.map(feature => (
                            <li key={feature.name} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                <span className="font-semibold">{feature.name}</span>
                                <p className="text-muted-foreground">{feature.pro}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                     {isLoading ? (
                        <Button className="w-full" disabled><Loader2 className="animate-spin"/></Button>
                     ) : isPro ? (
                        <Button className="w-full" disabled>Your Current Plan</Button>
                    ) : (
                        <Button className="w-full" onClick={handleUpgradeClick}>Upgrade to Pro</Button>
                    )}
                </CardFooter>
                </Card>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-muted/50 border-y">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Frequently Asked Questions
                    </h2>
                </div>
                 <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                                <div className="flex items-center gap-3">
                                    <ShieldQuestion className="h-5 w-5 text-muted-foreground" />
                                    {faq.question}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground pl-11">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
      </section>

      {/* Final CTA Section */}
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                    Ready to Get Your Edge?
                </h2>
                <p className="max-w-xl mx-auto mt-4 text-lg text-muted-foreground">
                    Don't be the last to know. Upgrade to Pro today and start making data-driven decisions with confidence.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="group relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40" onClick={handleUpgradeClick}>
                         <span className="absolute inset-[-1000%] animate-[shimmer_4s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff15_0%,#ffffff30_50%,#ffffff15_100%)]" />
                         <span className="relative z-10 flex items-center">
                            Upgrade and Unlock All Features <ArrowRight className="ml-2 h-4 w-4" />
                         </span>
                    </Button>
                </div>
            </div>
        </section>

    </div>
  );
}
