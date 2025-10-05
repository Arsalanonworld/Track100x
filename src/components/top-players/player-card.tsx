
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackButton } from "../track-button";
import { Button } from "../ui/button";
import { BellPlus, Trophy, ArrowUpRight, Percent } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CreateAlertDialog } from "../create-alert-dialog";
import { useState } from "react";
import type { Player } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const Stat = ({ icon, label, value, valueClass }: { icon: React.ReactNode, label: string, value: string, valueClass?: string }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <span className={cn("font-semibold", valueClass)}>{value}</span>
    </div>
)

export default function PlayerCard({ player }: { player: Player }) {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const handleOpenAlertEditor = () => setIsAlertEditorOpen(true);

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold text-muted-foreground">
                        #{player.rank}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <TrackButton walletAddress={player.address} />
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenAlertEditor}>
                                <BellPlus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center text-center">
                     <p className="text-2xl font-bold text-primary">{player.alias}</p>
                     <p className="font-mono text-xs text-muted-foreground mt-1">{player.address}</p>
                     <div className="flex gap-2 justify-center mt-4 flex-wrap">
                       {player.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                       {player.tags.length === 0 && <Badge variant="outline">N/A</Badge>}
                    </div>
                </CardContent>
                <CardContent className="space-y-3 border-t pt-6">
                    <Stat 
                        icon={<Trophy className="h-4 w-4" />}
                        label="Net Worth"
                        value={`$${(player.netWorth / 1_000_000).toFixed(2)}M`}
                    />
                     <Stat 
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        label="7d P&L"
                        value={`${player.pnlPercent > 0 ? '+' : ''}${player.pnlPercent}%`}
                        valueClass={player.pnlPercent > 0 ? "text-green-500" : "text-red-500"}
                    />
                     <Stat 
                        icon={<Percent className="h-4 w-4" />}
                        label="Win Rate"
                        value={`${player.winRate}%`}
                    />
                </CardContent>
            </Card>

            <CreateAlertDialog 
                onOpenChange={setIsAlertEditorOpen} 
                entity={{ type: 'wallet', identifier: player.address }}
            />
        </Dialog>
    )
}
