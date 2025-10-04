import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Bot, Trophy, Zap, BarChart2 } from 'lucide-react';

const features = [
    {
        icon: BarChart2,
        title: "Real-Time Data Edge",
        description: "Get an instant advantage with a zero-delay whale feed. See transactions as they happen, not minutes later.",
    },
    {
        icon: Trophy,
        title: "Full Whale Leaderboard",
        description: "Unlock the top 100 whale wallets, analyze their PnL and full history, and copy-trade the market's most profitable players.",
    },
    {
        icon: Zap,
        title: "Unlimited, Advanced Alerts",
        description: "Go beyond simple alerts. Use our multi-condition builder to create complex rules and receive them instantly via Telegram or Discord.",
    },
    {
        icon: Bot,
        title: "AI-Powered Insights",
        description: "Leverage our AI to curate news, analyze market sentiment, and uncover narratives before they become mainstream.",
    },
];

export default function UpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
        <section className="w-full max-w-5xl">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">An Unfair Advantage is Waiting</h1>
             <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Here's what you unlock with a Pro membership.</p>
             <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {features.map(feature => (
                    <div key={feature.title} className="flex flex-col items-center">
                        <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                            <feature.icon className="h-7 w-7"/>
                        </div>
                        <h3 className="text-lg font-bold font-headline mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
             </div>
        </section>
    </div>
  );
}
