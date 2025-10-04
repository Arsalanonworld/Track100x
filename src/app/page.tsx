
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { whaleTransactions } from '@/lib/mock-data';
import { CryptoIcon } from '@/components/crypto-icon';
import { ArrowRight, Bell, Filter, LayoutDashboard, Sparkles, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

// Typewriter effect component
import React, { useState, useEffect } from 'react';

const Typewriter = ({ titles }: { titles: string[] }) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentTitle = titles[titleIndex];
      if (isDeleting) {
        setDisplayedTitle(currentTitle.substring(0, displayedTitle.length - 1));
        setTypingSpeed(100);
      } else {
        setDisplayedTitle(currentTitle.substring(0, displayedTitle.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayedTitle === currentTitle) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedTitle === '') {
        setIsDeleting(false);
        setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayedTitle, isDeleting, titles, titleIndex, typingSpeed]);

  return <span className="text-primary">{displayedTitle}</span>;
};


const testimonials = [
    {
      name: 'CryptoWhale',
      handle: '@CryptoWhale',
      quote: 'WhaleWatch100x is my secret weapon. The real-time alerts give me an edge nobody else has. I caught a 50x on a memecoin thanks to this.',
      avatar: '/avatars/01.png',
    },
    {
      name: 'DeFi Dad',
      handle: '@DeFiDad',
      quote: 'The interface is clean, the data is accurate, and the advanced alerts are incredibly powerful. A must-have for any serious trader.',
      avatar: '/avatars/02.png',
    },
     {
      name: 'SOL Princess',
      handle: '@SolanaPrincess',
      quote: 'I track top trader wallets on Solana with this. The PnL leaderboard is a game-changer for finding new alpha.',
      avatar: '/avatars/03.png',
    },
     {
      name: 'notsofast',
      handle: '@notsofast',
      quote: "Finally, a tool that cuts through the noise. The whale feed is addictive and the insights are genuinely helpful.",
      avatar: '/avatars/04.png',
    },
  ];

  const insightArticles = [
    {
      title: 'A New Breed of Whale: How PEPE Changed the Memecoin Game',
      category: 'Whale Moves',
      description: 'An analysis of the top 10 wallets that profited most from the PEPE mania and their strategies.',
      image: 'https://picsum.photos/seed/insight1/600/400',
      imageHint: 'crypto trading',
      href: '/insights/pepe-whales',
    },
    {
      title: 'The Solana Renaissance: Is This the Ethereum Killer We Were Promised?',
      category: 'DeFi',
      description: 'Deep dive into Solana\'s DeFi ecosystem, on-chain metrics, and what top investors are betting on.',
      image: 'https://picsum.photos/seed/insight2/600/400',
      imageHint: 'blockchain network',
      href: '/insights/solana-renaissance',
    },
    {
      title: 'Strategy Guide: How to Spot and Front-Run Exchange Inflows',
      category: 'Strategy',
      description: 'A step-by-step guide to using on-chain data to anticipate major market moves before they happen.',
      image: 'https://picsum.photos/seed/insight3/600/400',
      imageHint: 'financial chart',
      href: '/insights/exchange-inflows',
    },
  ];

export default function DashboardPage() {
  return (
    <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <div className="text-center pt-8 pb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary-foreground mb-4">
            Track Smart Money. <br />
            <Typewriter titles={["Find Alpha.", "Anticipate Moves.", "Become the Whale."]} />
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            WhaleWatch100x gives you an unfair advantage with real-time whale tracking, advanced on-chain alerts, and AI-powered insights. Stop guessing, start winning.
            </p>
            <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/alerts">
                        <Bell className="mr-2"/>
                        Create Your First Alert
                    </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/leaderboard">
                        Explore Leaderboard
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>

        {/* Feature Bar Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold font-headline">Live Whale Feed</h3>
                <p className="text-sm text-muted-foreground">Real-time tracking of major transactions.</p>
            </div>
             <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold font-headline">Wallet Leaderboard</h3>
                <p className="text-sm text-muted-foreground">Discover and follow top-performing traders.</p>
            </div>
             <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold font-headline">Advanced Alerts</h3>
                <p className="text-sm text-muted-foreground">Custom, multi-condition notifications.</p>
            </div>
             <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold font-headline">Free to Start</h3>
                <p className="text-sm text-muted-foreground">Get instant access with a free account.</p>
            </div>
        </div>

        {/* Live Whale Feed Section */}
        <Card className="overflow-hidden">
            <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                <CardTitle className="text-2xl font-bold font-headline">Live Whale Feed</CardTitle>
                <CardDescription>
                    Real-time display of significant cryptocurrency transactions.
                </CardDescription>
                </div>
                 <div className="flex gap-2 flex-wrap">
                    <Select>
                        <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Token" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                        <SelectItem value="sol">Solana (SOL)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Apply Filters
                    </Button>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Blockchain</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {whaleTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <CryptoIcon token={tx.token} className="h-6 w-6" />
                            <span className="font-medium">{tx.token}</span>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">
                            ${tx.amountUSD.toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {tx.amountToken.toLocaleString()} {tx.token}
                        </div>
                        </TableCell>
                        <TableCell>
                        <Badge variant="secondary" className="font-mono">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant="secondary" className="font-mono">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline">{tx.blockchain}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                         <Button variant="ghost" size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Quick Alert
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>

        {/* Testimonials Section */}
         <div>
            <h2 className="text-3xl font-bold text-center font-headline mb-8">Trusted by Top Traders</h2>
             <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
                >
                <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <Card className="h-full flex flex-col">
                                <CardContent className="pt-6 flex-grow">
                                    <p className="text-primary-foreground">"{testimonial.quote}"</p>
                                </CardContent>
                                <CardHeader className="flex-row items-center gap-4 pt-0">
                                    <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" data-ai-hint="avatar" />
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>

        {/* Insights Preview Section */}
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-headline">AI-Powered Insights</h2>
                <Button variant="secondary" asChild>
                    <Link href="/insights">View All Articles <ArrowRight className="ml-2"/></Link>
                </Button>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                 {insightArticles.map((article) => (
                    <Card key={article.href} className="overflow-hidden group">
                        <Link href={article.href}>
                             <div className="aspect-video overflow-hidden">
                                <Image
                                src={article.image}
                                alt={article.title}
                                width={600}
                                height={400}
                                data-ai-hint={article.imageHint}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardHeader>
                                <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <CardDescription>{article.description}</CardDescription>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-primary/10 rounded-lg p-8 md:p-12 text-center border border-primary/20">
             <h2 className="text-3xl font-bold font-headline text-primary-foreground mb-4">Ready to Find Your 100x?</h2>
             <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                Stop missing out on major market moves. Create your first real-time whale alert for free and get an instant edge.
            </p>
            <Button size="lg" asChild>
                <Link href="/alerts">
                    <Zap className="mr-2"/>
                    Create Your First Free Alert
                </Link>
            </Button>
        </div>
    </div>
  );
}
