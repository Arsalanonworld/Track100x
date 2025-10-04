
'use client';

import React, { useState, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Loader2, Lock } from 'lucide-react';
import { generateNewsFeedAction } from './actions';
import type { AICuratedNewsFeedOutput } from '@/ai/flows/ai-curated-news-feed-for-pro-users';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function NewsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [feed, setFeed] = useState<AICuratedNewsFeedOutput | null>(null);
  const { user, isUserLoading } = useUser();
  const isPro = false; // Replace with actual user plan check

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userPreferences = formData.get('userPreferences') as string;

    if (!userPreferences.trim()) {
      toast({
        variant: "destructive",
        title: "Preferences required",
        description: "Please enter your news preferences to generate a feed.",
      });
      return;
    }

    startTransition(async () => {
      const response = await generateNewsFeedAction({
        userPreferences,
        trendingCryptoTopics: 'DeFi, Memecoins, Layer 2 scaling, Bitcoin ETFs',
        numberOfArticles: 5,
      });

      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error generating feed',
          description: response.error,
        });
        setFeed(null);
      } else {
        setFeed(response.data);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="AI-Curated News"
        description="A personalized news feed based on your interests and trending topics."
      />
      
      {!isPro && (
        <Alert className="mb-8 bg-primary/10 border-primary/20 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Lock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold font-headline mb-2">Unlock AI-Curated News</h3>
                <p className="text-muted-foreground mb-4 max-w-xs text-center">
                    This powerful, personalized news feed is an exclusive Pro feature.
                </p>
                <Button asChild>
                    <Link href="/upgrade">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </Link>
                </Button>
            </div>
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="font-headline text-primary">
            Exclusive Pro Feature
          </AlertTitle>
          <AlertDescription>
            Our AI-powered news engine curates a feed tailored just for you.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Your Feed Preferences</CardTitle>
                <CardDescription>
                  Tell us what you're interested in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="user-preferences">Topics</Label>
                  <Input
                    id="user-preferences"
                    name="userPreferences"
                    placeholder="e.g., Solana, NFTs, AI in crypto"
                    defaultValue="Solana, AI"
                    disabled={!isPro || isPending}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!isPro || isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Feed...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate My Feed
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-4">
            Your Top Stories
          </h2>
          <div className="space-y-4">
            {isPending && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-full min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Curating your personalized news...
                </p>
              </div>
            )}
            {!isPending && !feed && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-full min-h-[300px]">
                <p className="text-muted-foreground">
                  {isPro ? 'Generate your feed to see the latest stories.' : 'Upgrade to Pro to see your personalized news feed.'}
                </p>
              </div>
            )}
            {feed?.articles.map((article, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{article.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
