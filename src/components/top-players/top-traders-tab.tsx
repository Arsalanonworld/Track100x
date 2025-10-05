
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Lock, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackButton } from "../track-button";

const mockTraders = [
    { rank: 1, alias: 'Meme Master', pnl: 205, winRate: 65, topToken: 'PEPE', tags: ['NFT Flipper', 'Memes'], address: '0x001...MemeMaster' },
    { rank: 2, alias: 'DeFi Degen', pnl: 180, winRate: 72, topToken: 'AAVE', tags: ['Yield Farmer'], address: '0x002...DeFiDegen' },
    { rank: 3, alias: 'Solana Surfer', pnl: 175, winRate: 58, topToken: 'WIF', tags: ['Solana Eco'], address: '0x003...SolanaSurfer' },
    { rank: 4, alias: 'Alpha Hunter', pnl: 160, winRate: 80, topToken: 'RNDR', tags: ['AI Coins'], address: '0x004...AlphaHunter' },
    { rank: 5, alias: 'Gas Wizard', pnl: 155, winRate: 90, topToken: 'ETH', tags: ['Layer 2'], address: '0x005...GasWizard' },
    { rank: 6, alias: 'Airdrop King', pnl: 142, winRate: 55, topToken: 'JUP', tags: ['Airdrop Farmer'], address: '0x006...AirdropKing' },
    { rank: 7, alias: 'NFT Shark', pnl: 138, winRate: 68, topToken: 'PUNKS', tags: ['NFTs'], address: '0x007...NFTShark' },
    { rank: 8, alias: 'The Oracle', pnl: 135, winRate: 75, topToken: 'LINK', tags: ['Oracles', 'Infrastructure'], address: '0x008...TheOracle' },
    { rank: 9, alias: 'Stable Genius', pnl: 121, winRate: 95, topToken: 'USDC', tags: ['Low Risk'], address: '0x009...StableGenius' },
    { rank: 10, alias: 'Chain Hopper', pnl: 115, winRate: 62, topToken: 'ATOM', tags: ['Interoperability'], address: '0x010...ChainHopper' },
    { rank: 11, alias: 'Token Sniper', pnl: 110, winRate: 50, topToken: 'BONK', tags: ['New Listings'], address: '0x011...TokenSniper' },
    { rank: 12, alias: 'Liquidity Baron', pnl: 105, winRate: 85, topToken: 'UNI', tags: ['LP Provider'], address: '0x012...LiquidityBaron' },
    { rank: 13, alias: 'The Contrarian', pnl: 98, winRate: 59, topToken: 'MKR', tags: [], address: '0x013...TheContrarian' },
    { rank: 14, alias: 'Gaming Guilder', pnl: 95, winRate: 66, topToken: 'AXS', tags: ['GameFi'], address: '0x014...GamingGuilder' },
    { rank: 15, alias: 'Based Bagger', pnl: 92, winRate: 70, topToken: 'AERO', tags: ['Base Chain'], address: '0x015...BasedBagger' },
    { rank: 16, alias: 'LST Pioneer', pnl: 88, winRate: 88, topToken: 'LDO', tags: ['Liquid Staking'], address: '0x016...LSTPioneer' },
    { rank: 17, alias: 'The Accumulator', pnl: 85, winRate: 92, topToken: 'BTC', tags: ['Long Term'], address: '0x017...TheAccumulator' },
    { rank: 18, alias: 'Runes Raider', pnl: 82, winRate: 48, topToken: 'DOG', tags: ['Runes'], address: '0x018...RunesRaider' },
    { rank: 19, alias: 'Points Pro', pnl: 79, winRate: 78, topToken: 'ETH', tags: ['Points Farming'], address: '0x019...PointsPro' },
    { rank: 20, alias: 'Diamond Hand', pnl: 75, winRate: 60, topToken: 'GME', tags: ['Memes'], address: '0x020...DiamondHand' },
];

export default function TopTradersTab({ isPro }: { isPro: boolean }) {
    if (!isPro) {
        return (
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 blur-sm">
                   {mockTraders.map((trader) => (
                    <Card key={trader.rank} className="p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-lg font-bold text-muted-foreground">#{trader.rank}</p>
                            <Button variant="ghost" size="icon" disabled className="h-8 w-8"><Star className="h-4 w-4 text-muted-foreground" /></Button>
                        </div>
                        <div className="text-center my-auto flex-grow">
                            <p className="font-bold text-xl text-primary">{trader.alias}</p>
                            <div className="flex gap-2 justify-center mt-2 flex-wrap">
                            {trader.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </div>
                        <div className="space-y-2 text-sm mt-4">
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
                    </Card>
                ))}
                </div>
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-center p-8 space-y-4 bg-card/95 border rounded-lg shadow-2xl">
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
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTraders.map((trader) => (
                 <Card key={trader.rank} className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-lg font-bold text-muted-foreground">#{trader.rank}</p>
                         <TrackButton walletAddress={trader.address} />
                    </div>
                     <div className="text-center my-auto flex-grow">
                        <p className="font-bold text-xl text-primary">{trader.alias}</p>
                         <div className="flex gap-2 justify-center mt-2 flex-wrap">
                           {trader.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                     </div>
                    <div className="space-y-2 text-sm mt-4">
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
                </Card>
            ))}
        </div>
    )
}
