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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, FileText, Sparkles, Loader2 } from 'lucide-react';
import { generateInsightArticleAction } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function InsightsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<{ articleTitle: string; contentIdeas: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trendingTransactions = formData.get('trendingTransactions') as string;

    if (!trendingTransactions.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please describe the trending transactions to generate insights.",
      });
      return;
    }

    startTransition(async () => {
      const response = await generateInsightArticleAction({ trendingTransactions });
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error generating insights',
          description: response.error,
        });
        setResult(null);
      } else {
        setResult(response.data);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="AI-Powered Insights"
        description="Generate article titles and content ideas from whale activity."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Generate Article Ideas
              </CardTitle>
              <CardDescription>
                Describe trending whale transactions to get AI-generated article
                suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="trending-transactions">
                  Trending Transactions
                </Label>
                <Textarea
                  id="trending-transactions"
                  name="trendingTransactions"
                  placeholder="e.g., A whale just moved 10,000 ETH to a new wallet, then swapped half for a new memecoin..."
                  rows={5}
                  disabled={isPending}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Content
            </CardTitle>
            <CardDescription>
              Your AI-generated article title and ideas will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isPending && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Generating your content...</p>
              </div>
            )}
            {!isPending && !result && (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Results will be displayed here once generated.</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg font-headline">
                    Suggested Title
                  </h3>
                  <p className="text-primary-foreground">{result.articleTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg font-headline">
                    Content Ideas
                  </h3>
                  <p className="whitespace-pre-wrap">{result.contentIdeas}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
