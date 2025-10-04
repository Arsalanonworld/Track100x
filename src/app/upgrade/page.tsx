
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Users, Bot, Trophy, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const proFeatures = [
  { text: 'Unlimited feed history' },
  { text: 'Unlimited Quick + Advanced Alerts' },
  { text: 'Full Leaderboard (Top 100 wallets)' },
  { text: 'Whale wallet deep activity stats' },
  { text: 'Multi-channel alerts (email, push, Discord/Telegram bot)' },
  { text: 'Priority updates (new features)' },
];

const freeFeatures = [
  { text: 'Real-time whale feed (last 20 tx only)' },
  { text: 'Basic filters (token/chain)' },
  { text: '1 Quick Alert' },
];

const features = [
    {
        icon: Zap,
        title: "Real-Time Smart Alerts",
        description: "Don't just track transactions, anticipate them. Create complex, multi-condition alerts that trigger on token price changes, PnL shifts, or specific wallet activities. Get notified via Email, Telegram, or Discord before the market moves.",
        pro: true,
    },
    {
        icon: BarChart2,
        title: "The Ultimate Leaderboard",
        description: "Go beyond the top 10. Get full access to the Top 100 most profitable and active wallets. Analyze their strategies, top holdings, and historical performance to find your next alpha.",
        pro: true,
    },
    {
        icon: ShieldCheck,
        title: "Wallet Intelligence",
        description: "Turn data into decisions. See deep activity stats, historical PnL, and common counterparties for any whale wallet. Understand their strategy so you can refine your own.",
        pro: true,
    }
]

const faqs = [
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your Pro subscription at any time. You will retain access to Pro features until the end of your billing cycle."
    },
    {
        question: "What happens after I upgrade?",
        answer: "Once you upgrade, all Pro features will be unlocked for your account instantly. You can start creating unlimited advanced alerts, access the full leaderboard, and view complete transaction histories right away."
    },
    {
        question: "Do you offer a trial for the Pro plan?",
        answer: "We do not currently offer a free trial for the Pro plan. However, you can subscribe for a month to test out all the features and cancel at any time if you're not satisfied."
    }
]


export default function UpgradePage() {
  return (
    <div className="space-y-20 md:space-y-32">
        {/* Hero Section */}
        <section className="text-center pt-12 md:pt-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-headline">
                Don't Follow the News. <br/> Follow the Money.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4 mb-8">
                Stop reacting to old news. Track100x Pro gives you the real-time on-chain data and advanced tools you need to anticipate market moves before they happen.
            </p>
            <Button size="lg">
                Upgrade to Pro Now
                <ArrowRight className="ml-2" />
            </Button>
            <div className="mt-16">
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Trusted by Top Traders & Analysts</p>
                <div className="mt-6 flex justify-center items-center gap-8 md:gap-12 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2"><Users /><span>CRYPTO FUND</span></div>
                    <div className="flex items-center gap-2"><Bot /><span>DEGEN TRADERS</span></div>
                    <div className="flex items-center gap-2"><Trophy /><span>ALPHA HUNTERS</span></div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="text-center max-w-4xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">An Unfair Advantage is Waiting</h2>
             <p className="text-lg text-muted-foreground mt-4">Here's how Track100x Pro gives you a real-time edge.</p>
             <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                {features.map(feature => (
                    <Card key={feature.title} className="bg-card/50">
                        <CardHeader>
                            <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="h-6 w-6"/>
                            </div>
                            <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
             </div>
        </section>

        {/* Pricing Section */}
        <section>
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">Find the Plan That's Right For You</h2>
                <p className="text-lg text-muted-foreground mt-4">Start for free, then upgrade to unlock the full power of on-chain intelligence.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto mt-12">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Free</CardTitle>
                        <CardDescription>
                            Perfect for getting started with on-chain data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <p className="font-semibold">What's included:</p>
                        <ul className="space-y-3">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="secondary" disabled>Your Current Plan</Button>
                    </CardFooter>
                </Card>
                <Card className="border-2 border-primary shadow-2xl shadow-primary/20 relative">
                    <div className="absolute top-0 right-4 -mt-3">
                         <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">MOST POPULAR</div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Pro</CardTitle>
                        <CardDescription>
                            For serious traders who need a real-time edge.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold">$29</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <p className="font-semibold">Everything in Free, plus:</p>
                        <ul className="space-y-3">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary" />
                                <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg">Upgrade to Pro</Button>
                    </CardFooter>
                </Card>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
             <div className="text-center">
                <h2 className="text-4xl font-bold font-headline">Frequently Asked Questions</h2>
             </div>
             <Accordion type="single" collapsible className="w-full mt-8">
                {faqs.map(faq => (
                    <AccordionItem value={faq.question} key={faq.question}>
                        <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    </div>
  );
}
