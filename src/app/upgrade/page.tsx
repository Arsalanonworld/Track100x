
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Bot, Landmark, Target, Trophy, Users, Zap } from 'lucide-react';
import { PricingCard } from '@/components/pricing-card';
import { Faq } from '@/components/faq';

const features = [
  {
    icon: BarChart2,
    title: 'Real-Time Data Edge',
    description: 'Get an instant advantage with a zero-delay whale feed. See transactions as they happen, not minutes later.',
  },
  {
    icon: Trophy,
    title: 'Full Whale Leaderboard',
    description: 'Unlock the top 100 whale wallets, analyze their PnL and full history, and copy-trade the market\'s most profitable players.',
  },
  {
    icon: Zap,
    title: 'Unlimited, Advanced Alerts',
    description: 'Go beyond simple alerts. Use our multi-condition builder to create complex rules and receive them instantly via Telegram or Discord.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Insights',
    description: 'Leverage our AI to curate news, analyze market sentiment, and uncover narratives before they become mainstream.',
  },
];

const trustIcons = [
    { icon: Landmark, label: 'CRYPTO FUND' },
    { icon: Users, label: 'DEGEN TRADERS' },
    { icon: Target, label: 'ALPHA HUNTERS' },
]

export default function UpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-16 md:space-y-24 py-16 md:py-24">
        {/* Hero Section */}
        <section className="w-full max-w-4xl space-y-6">
             <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline">Don't Follow the News. <br/>Follow the Money.</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Track100x Pro gives you an unparalleled edge with real-time data, advanced alerts, and deep on-chain analysis. Stop guessing and start winning.</p>
             <Button size="lg" className="text-lg">
                Upgrade to Pro Now <ArrowRight className="ml-2" />
             </Button>
        </section>

        {/* Trust Bar */}
        <section className="w-full max-w-5xl">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-6">TRUSTED BY TOP TRADERS & ANALYSTS</h3>
            <div className="flex justify-center items-center gap-12 md:gap-24">
                {trustIcons.map(item => (
                    <div key={item.label} className="flex items-center gap-3 text-muted-foreground">
                        <item.icon className="h-6 w-6"/>
                        <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full max-w-5xl">
             <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">An Unfair Advantage is Waiting</h2>
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Here's what you unlock with a Pro membership.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {features.map(feature => (
                    <div key={feature.title} className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-all">
                        <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                            <feature.icon className="h-7 w-7"/>
                        </div>
                        <h3 className="text-lg font-bold font-headline mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
             </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-5xl">
             <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">Choose Your Plan</h2>
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Start for free, then upgrade to unlock the full power of Track100x.</p>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <PricingCard 
                    plan="Free"
                    price="Free"
                    description="Get a taste of on-chain intelligence."
                    features={[
                        { text: 'Real-time whale feed (last 20 tx)', included: true },
                        { text: 'Basic filters (token/chain)', included: true },
                        { text: '1 Quick Alert', included: true },
                        { text: 'Advanced alerts builder', included: false },
                        { text: 'Full leaderboard access', included: false },
                        { text: 'Historical data export', included: false },
                        { text: 'Multi-channel alerts', included: false },
                    ]}
                    ctaText="Your Current Plan"
                    ctaVariant="outline"
                    disabled
                />
                <PricingCard
                    plan="Pro"
                    price="$49"
                    pricePeriod="/ month"
                    description="Unlock your full potential as a trader."
                    features={[
                        { text: 'Unlimited feed history', included: true },
                        { text: 'Unlimited Quick + Advanced Alerts', included: true },
                        { text: 'Full Leaderboard (Top 100 wallets)', included: true },
                        { text: 'Whale wallet deep activity stats', included: true },
                        { text: 'Multi-channel alerts (Telegram, Discord)', included: true },
                        { text: 'AI-powered insights & reports', included: true },
                        { text: 'Priority access to new features', included: true },
                    ]}
                    ctaText="Upgrade to Pro"
                    highlight
                />
            </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-3xl">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">Frequently Asked Questions</h2>
            </div>
            <Faq />
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight font-headline mb-4">Ready to Get Your Edge?</h2>
            <p className="text-lg text-muted-foreground mb-8">Stop missing opportunities. Upgrade now and see what the whales are doing in real-time.</p>
            <Button size="lg" className="text-lg">
                Upgrade and Start Tracking
                <ArrowRight className="ml-2"/>
            </Button>
        </section>
    </div>
  );
}
