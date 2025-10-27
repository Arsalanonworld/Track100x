
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/components/crypto-icon";
import type { TrendingToken } from "@/lib/types";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TrendingTokenCard({ token }: { token: TrendingToken }) {
    const isUp = token.priceChange >= 0;

    return (
        <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CryptoIcon token={token.symbol} className="h-10 w-10" />
                    <div>
                        <CardTitle className="text-xl">{token.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">${token.symbol}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                 <div>
                    <p className="text-xs text-muted-foreground">24h Price Change</p>
                     <p className={cn(
                        "text-lg font-bold",
                        isUp ? "text-green-500" : "text-red-500"
                     )}>
                        {isUp ? '+' : ''}{token.priceChange.toFixed(2)}%
                    </p>
                </div>
                 <div>
                    <p className="text-xs text-muted-foreground">24h Whale Buys</p>
                    <p className="text-lg font-bold">{token.whaleBuys}</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 {token.swapUrl && (
                    <Button asChild className="w-full" size="sm">
                        <Link href={token.swapUrl} target="_blank" rel="noopener noreferrer">
                           Swap on Jupiter <ArrowUpRight className="h-4 w-4 ml-2"/>
                        </Link>
                    </Button>
                )}
                {token.pumpFunUrl && (
                    <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href={token.pumpFunUrl} target="_blank" rel="noopener noreferrer">
                            Buy on Pump.fun <ShoppingCart className="h-4 w-4 ml-2"/>
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
