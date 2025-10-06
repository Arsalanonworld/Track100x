
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, PieChart, TrendingUp, Activity, Sparkles, ShieldCheck, Copy } from 'lucide-react';
import WalletAnalyticsDashboard from './_components/wallet-analytics-dashboard';
import { StickyScrollFeatures } from '@/components/sticky-scroll-features';

const features = [
    {
        title: "Comprehensive Portfolio Breakdown",
        description: "Visualize token allocation, quantity, and current market value with our interactive pie chart and detailed holdings table.",
        contentSlug: "feature-portfolio-breakdown"
    },
    {
        title: "In-Depth PnL Analysis",
        description: "Track realized and unrealized gains and losses over various timeframes to understand true wallet performance.",
        contentSlug: "feature-pnl-analysis"
    },
    {
        title: "On-Chain Activity Heatmap",
        description: "Visualize transaction patterns, interaction frequency, and gas usage over the past year to spot trends.",
        contentSlug: "feature-heatmap"
    },
    {
        title: "AI-Powered Strategic Insights",
        description: "Receive AI-generated summaries of a wallet's trading strategy, risk profile, and potential for high-multiple returns.",
        contentSlug: "feature-ai-insights"
    },
];


const WalletSearch = ({ onSearch }: { onSearch: (address: string) => void }) => {
    const [address, setAddress] = useState('');

    const handleSearch = () => {
        if (address) {
            onSearch(address);
        } else {
            // For demo purposes, we'll search a mock address if the input is empty
            onSearch('0x1a2b3c4d5e6f7g8h9i0j1k213m4n5o6p7q8r9s0t');
        }
    }

    return (
        <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto pt-8">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
                    The Ultimate Wallet Analyzer
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                    Uncover the secrets of any wallet. Paste an address to get a complete breakdown of its holdings, historical performance, risk profile, and on-chain behavior.
                </p>
                <div className="mt-8 flex max-w-lg mx-auto">
                    <div className="flex w-full gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Paste any wallet address or ENS name"
                                className="pl-10 h-12 text-base"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button size="lg" onClick={handleSearch} className="h-12">
                            Analyze <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            <StickyScrollFeatures features={features} />

        </div>
    );
}

export default function WalletAnalyticsPage() {
  const [analyzedAddress, setAnalyzedAddress] = useState<string | null>(null);

  return (
    <div className="space-y-8">
        {!analyzedAddress ? (
            <WalletSearch onSearch={setAnalyzedAddress} />
        ) : (
            <WalletAnalyticsDashboard 
                walletAddress={analyzedAddress}
                onBack={() => setAnalyzedAddress(null)} 
            />
        )}
    </div>
  );
}
