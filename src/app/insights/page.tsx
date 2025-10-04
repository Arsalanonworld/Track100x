
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
import { ProFeatureLock } from '@/components/pro-feature-lock';
import { AnimatedButton } from '@/components/ui/animated-button';

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
  const isLoading = isUserLoading || isUserDataLoading;

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesSearch = searchTerm === '' || 
                              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              article.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const getVisibleArticleCount = () => {
    if(isPro) return filteredArticles.length;
    if(user) return 2; // Logged-in free users see more
    return 1; // Logged-out guests see the least
  }

  const visibleArticles = useMemo(() => {
    return filteredArticles.slice(0, getVisibleArticleCount());
  }, [filteredArticles, isPro, user]);

  const lockedArticles = useMemo(() => {
    return filteredArticles.slice(getVisibleArticleCount(), getVisibleArticleCount() + 3);
  }, [filteredArticles, getVisibleArticleCount]);

  const hasMoreArticles = filteredArticles.length > visibleArticles.length;
  const showLoginWall = !user && !isUserLoading;
  const showUpgradeWall = user && !isPro;


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
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                  {hasMoreArticles && lockedArticles.map((article) => (
                     <div key={article.id} className="relative blur-sm pointer-events-none">
                        <ArticleCard article={article} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-foreground" />
                        </div>
                     </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg font-semibold">No articles found.</p>
                  <p>Try adjusting your search or category filters.</p>
              </div>
            )}
            
            {hasMoreArticles && (
              <div className="mt-12 text-center">
                  {showLoginWall && (
                     <ProFeatureLock
                        title="Unlock All Articles & Research"
                        description="Get full access to our premium analysis, deep dives, and strategy guides."
                        buttonText="Log In to Continue Reading"
                        onButtonClick={() => setAuthDialogOpen(true)}
                     />
                  )}
                   {showUpgradeWall && (
                      <ProFeatureLock
                        title="Unlock the Full Archive"
                        description="Your free account gives you access to recent posts. Upgrade to Pro to unlock our entire library of in-depth research and analysis."
                      />
                  )}
                 </div>
            )}
        </div>
      </section>
    </>
  );
}
