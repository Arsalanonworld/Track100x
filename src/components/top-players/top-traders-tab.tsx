
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Lock, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackButton } from "../track-button";

const mockTraders = [
    { rank: 1, alias: 'Meme Master', pnl: 20, winRate: 65, topToken: 'SHIB', tags: ['NFT Flipper'], address: '0x000...MemeMaster' },
    { rank: 2, alias: 'DeFi Degen', pnl: 15, winRate: 72, topToken: 'AAVE', tags: ['Yield Farmer'], address: '0x000...DeFiDegen' },
    { rank: 3, alias: 'Solana Surfer', pnl: 35, winRate: 58, topToken: 'WIF', tags: [], address: '0x000...SolanaSurfer' },
];

export default function TopTradersTab({ isPro }: { isPro: boolean }) {
    if (!isPro) {
        return (
            <Card className="relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm">
                   {mockTraders.map((trader) => (
                    <Card key={trader.rank} className="p-4">
                        <div className="flex justify-between items-start">
                            <p className="text-lg font-bold">#{trader.rank}</p>
                            <p className="font-bold text-lg text-primary">{trader.alias}</p>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">7d P&L</span>
                                <span className="font-medium text-green-500">+{trader.pnl}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Win Rate</span>
                                <span className="font-medium">{trader.winRate}%</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Top Token</span>
                                <span className="font-medium">{trader.topToken}</span>
                            </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline" disabled>
                           <Star className="h-4 w-4 mr-2" />
                            Track
                        </Button>
                    </Card>
                ))}
                </div>
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                    <div className="text-center p-8 space-y-4">
                        <Lock className="w-8 h-8 text-primary mx-auto" />
                        <h3 className="text-2xl font-bold">Unlock Top Traders</h3>
                        <p className="text-muted-foreground max-w-sm">
                            See aggregated profiles of the best traders, their win rates, and top tokens.
                        </p>
                        <Button asChild>
                            <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTraders.map((trader) => (
                 <Card key={trader.rank} className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start">
                        <p className="text-lg font-bold text-muted-foreground">#{trader.rank}</p>
                        <div className="flex gap-2">
                           {trader.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </div>
                     <div className="text-center my-4 flex-grow">
                        <p className="font-bold text-xl text-primary">{trader.alias}</p>
                     </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">7d P&L</span>
                            <span className="font-medium text-green-500">+{trader.pnl}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Win Rate</span>
                            <span className="font-medium">{trader.winRate}%</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Top Token</span>
                            <span className="font-medium">{trader.topToken}</span>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <TrackButton walletAddress={trader.address} />
                    </div>
                </Card>
            ))}
        </div>
    )
}
