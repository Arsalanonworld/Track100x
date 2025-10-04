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
import { Check } from 'lucide-react';
import Link from 'next/link';

const proFeatures = [
  'Unlimited Alerts',
  'Advanced Alert Builder',
  'Real-Time Whale Feed',
  'Full Leaderboard (Top 100)',
  'AI-Curated News Feed',
  'Exclusive Pro Insights',
  'Discord & Telegram Notifications',
  'API Access',
];

const freeFeatures = [
    '3 Active Alerts',
    'Quick Alerts Only',
    '15-Minute Delayed Feed',
    'Leaderboard (Top 10)',
    'Email Notifications',
];


export default function UpgradePage() {
  return (
    <>
      <PageHeader
        title="Upgrade to Pro"
        description="Unlock the full power of Track100x and get an unfair advantage."
      />

      <div className="grid md:grid-cols-2 gap-8">
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
            <p>What's included:</p>
            <ul className="space-y-3">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">Upgrade to Pro</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Free Plan</CardTitle>
            <CardDescription>
                Perfect for getting started with on-chain analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/ month</span>
            </div>
            <p>What's included:</p>
            <ul className="space-y-3">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-muted-foreground" />
                   <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
             <Button className="w-full" variant="secondary" disabled>Your Current Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
