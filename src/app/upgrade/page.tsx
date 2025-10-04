import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const proFeatures = [
    { text: 'Unlimited feed history', included: true },
    { text: 'Unlimited Quick + Advanced Alerts', included: true },
    { text: 'Full Leaderboard (Top 100 wallets)', included: true },
    { text: 'Whale wallet deep activity stats', included: true },
    { text: 'Multi-channel alerts (email, push, Discord/Telegram bot)', included: true },
    { text: 'Priority updates (new features)', included: true },
];

const freeFeatures = [
    { text: 'Real-time whale feed (last 20 tx only)', included: true },
    { text: 'Basic filters (token/chain)', included: true },
    { text: '1 Quick Alert', included: true },
    { text: 'No advanced alerts', included: false },
    { text: 'No full leaderboard access', included: false },
    { text: 'No historical data', included: false },
];


export default function UpgradePage() {
  return (
    <>
      <PageHeader
        title="Unlock Full Whale Power with Track100x Pro"
        description="Go beyond the free feed. Get unlimited alerts, full history, and smart whale insights."
      />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Free Plan</CardTitle>
            <CardDescription>
                Your current plan. Perfect for getting started.
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
                  {feature.included ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-muted-foreground" />}
                   <span className={!feature.included ? "text-muted-foreground" : ""}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
             <Button className="w-full" variant="secondary" disabled>Your Current Plan</Button>
          </CardFooter>
        </Card>
        <Card className="border-2 border-primary shadow-2xl shadow-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">Pro Plan</CardTitle>
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
                  <Check className="h-5 w-5 text-green-500" />
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
    </>
  );
}
