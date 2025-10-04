
'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@/components/article-card';
import { mockArticles as allArticles, type Article } from '@/lib/insights-data';
import { Input } from '@/components/ui/input';
import { Search, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

const allCategories = ['All', ...Array.from(new Set(allArticles.map(a => a.category)))];

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { setAuthDialogOpen } = useAuthDialog();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isPro = userData?.plan === 'pro';

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesSearch = searchTerm === '' || 
                              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              article.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const visibleArticles = useMemo(() => {
    if (isPro || user) {
        return filteredArticles;
    }
    return filteredArticles.slice(0, 3);
  }, [filteredArticles, isPro, user]);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Insights & Research
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            In-depth analysis, research, and strategy guides from our on-chain experts.
        </p>
      </div>

      <section>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allCategories.map(category => (
                  <Button 
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className={cn('transition-colors', selectedCategory === category && 'text-primary-foreground')}
                  >
                      {category}
                  </Button>
              ))}
            </div>
        </div>
      
        <div className="relative">
            {visibleArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg font-semibold">No articles found.</p>
                  <p>Try adjusting your search or category filters.</p>
              </div>
            )}
            
            {(!user && !isUserLoading && visibleArticles.length > 0) && (
                 <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background to-transparent z-10 flex items-end justify-center pb-8">
                      <div className="text-center p-8 rounded-lg bg-background/95">
                          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-xl font-bold font-headline">Unlock All Articles & Research</h3>
                          <p className="text-muted-foreground mb-4 max-w-sm">Get full access to our premium analysis, deep dives, and strategy guides.</p>
                          <Button onClick={() => setAuthDialogOpen(true)} size="lg">
                              Log In to Continue Reading
                          </Button>
                      </div>
                  </div>
            )}
        </div>
      </section>

      {!isPro && user && (
        <>
            <Separator className="my-16" />
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Unlock the Full Archive</h2>
                <p className="mt-4 text-lg text-muted-foreground">Your free account gives you access to recent posts. Upgrade to Pro to unlock our entire library of in-depth research and analysis.</p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/upgrade">Upgrade to Pro</Link>
                    </Button>
                </div>
            </div>
        </>
      )}

    </>
  );
}
