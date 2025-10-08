
'use client';

import { WhaleFeed } from '@/components/whale-feed';
import HeroSection from '@/components/hero-section';
import { HomePageCta } from '@/components/home-page-cta';
import { StickyScrollFeatures } from '@/components/sticky-scroll-features';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceHolderImagesById } from '@/lib/placeholder-images';
import { ArrowRight, Bell, Newspaper, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const featureHighlights = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Advanced Alert Builder',
        description: 'Create complex, multi-conditional alerts to precisely monitor specific on-chain events and strategies.',
    },
    {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: 'Unlimited Telegram Alerts',
        description: 'Create unlimited alerts and get notified instantly via Telegram to never miss a move.',
    },
    {
        icon: <Newspaper className="h-8 w-8 text-primary"/>,
        title: 'AI Insights & Daily Digest',
        description: 'Get AI-generated summaries and a daily digest of the most important whale movements and market signals.',
    },
     {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: 'Ad-Free Experience',
        description: 'Enjoy a clean, uninterrupted interface focused solely on the data and insights that matter.',
    },
];

const testimonials = [
  {
    avatar: PlaceHolderImagesById['avatar-01'].imageUrl,
    name: 'Alex T.',
    title: 'DeFi Analyst',
    quote: 'The advanced alert builder is a game-changer. I can finally set up the complex, multi-layered triggers I need to monitor my strategies. No other platform comes close.',
  },
  {
    avatar: PlaceHolderImagesById['avatar-02'].imageUrl,
    name: 'Jen W.',
    title: 'Meme Coin Trader',
    quote: "The real-time feed is insanely fast. I see the whale buys before they show up anywhere else, which has given me a massive edge in catching new narratives early.",
  },
  {
    avatar: PlaceHolderImagesById['avatar-03'].imageUrl,
    name: 'Marcus B.',
    title: 'Early-Stage Investor',
    quote: 'Following the wallets from the leaderboard has been a masterclass in on-chain analysis. It’s like having a team of elite researchers working for me 24/7.',
  },
];


function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Serious On-Chain Analysts</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          From professional funds to solo traders, Track100x is the go-to platform for gaining a market edge.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="flex flex-col p-6">
            <CardContent className="p-0 flex-1">
              <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
            </CardContent>
            <CardHeader className="p-0 pt-6 flex flex-row items-center gap-4">
                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" data-ai-hint="avatar" />
              <div className="flex flex-col">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}


export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-12 lg:-mt-8">
      {/* Hero Section */}
      <HeroSection />

      <div className="container">
        {/* Whale Feed Section */}
        <div id="whale-feed">
          <WhaleFeed isPreview={true} />
        </div>
        
        {/* Feature Highlights Section */}
        <StickyScrollFeatures features={featureHighlights} />

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-2">Your Market Edge is One Alert Away.</h2>
            <p className="text-muted-foreground text-lg mb-6">Create a custom alert now and never miss a critical market move again.</p>
            <Button asChild size="lg">
                <Link href="/watchlist">
                    Create a Free Alert
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
