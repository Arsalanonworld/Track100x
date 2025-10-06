'use client';

import PageHeader from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArticles, type Article } from '@/lib/insights-data';
import ArticleCard from '@/components/article-card';

export default function CryptoPulsePage() {

    const allArticles = mockArticles;
    const analysisArticles = allArticles.filter(a => a.category === 'Market Analysis' || a.category === 'Whale Watch');
    const educationArticles = allArticles.filter(a => a.category === 'Education' || a.category === 'Strategy' || a.category === 'Technology');
    const defiArticles = allArticles.filter(a => a.category === 'DeFi');
    
    const ArticleGrid = ({ articles }: { articles: Article[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Crypto Pulse"
                description="The latest insights, analysis, and educational content on the world of on-chain intelligence."
            />

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="defi">DeFi</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-6">
                    <ArticleGrid articles={allArticles} />
                </TabsContent>
                <TabsContent value="analysis" className="pt-6">
                    <ArticleGrid articles={analysisArticles} />
                </TabsContent>
                <TabsContent value="education" className="pt-6">
                    <ArticleGrid articles={educationArticles} />
                </TabsContent>
                <TabsContent value="defi" className="pt-6">
                    <ArticleGrid articles={defiArticles} />
                </TabsContent>
            </Tabs>
        </div>
    );
}