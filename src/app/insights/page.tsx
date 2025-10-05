
'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@/components/article-card';
import { mockArticles as allArticles, type Article } from '@/lib/insights-data';
import { Input } from '@/components/ui/input';
import { Search, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import Link from 'next/link';

const allCategories = ['All', ...Array.from(new Set(allArticles.map(a => a.category)))];

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user, claims } = useUser();
  const isPro = claims?.plan === 'pro';

  const articlesToShow = isPro ? allArticles : allArticles.slice(0, 3);

  const filteredArticles = useMemo(() => {
    return articlesToShow.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesSearch = searchTerm === '' || 
                              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              article.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, articlesToShow]);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
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
            {!isPro && (
                <div className="absolute inset-0 z-10 flex items-center justify-center -bottom-1/3">
                    <div className='absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent'></div>
                    <div className="relative text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg">
                        <Lock className="w-8 h-8 text-primary mx-auto" />
                        <h3 className="text-2xl font-bold">Unlock All Insights</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Get full access to all articles, research, and strategy guides by upgrading to Pro.
                        </p>
                        <Button asChild>
                            <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                        </Button>
                    </div>
                </div>
            )}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg font-semibold">No articles found.</p>
                  <p>Try adjusting your search or category filters.</p>
              </div>
            )}
        </div>
      </section>
    </>
  );
}
