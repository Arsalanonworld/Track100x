
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { walletLeaderboard } from '@/lib/mock-data'
import { cn } from "@/lib/utils"
import { TrackButton } from "../track-button";
import { Button } from "../ui/button";
import { BellPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CreateAlertDialog } from "../create-alert-dialog";
import { useState } from "react";
import type { Wallet } from "@/lib/mock-data";


export default function TopWalletsTab() {
    const topWallets = walletLeaderboard.slice(0, 10);
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    const handleOpenAlertEditor = (wallet: Wallet) => {
        setSelectedWallet(wallet);
        setIsAlertEditorOpen(true);
    }

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Net Worth</TableHead>
                    <TableHead>P&L (7d)</TableHead>
                    <TableHead>Last Tx</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topWallets.map((wallet) => (
                    <TableRow key={wallet.rank}>
                        <TableCell className="font-medium text-lg text-center">
                        #{wallet.rank}
                        </TableCell>
                        <TableCell>
                        <Badge variant="secondary" className="font-mono">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                        ${(wallet.netWorth / 1_000_000).toFixed(2)}M
                        </TableCell>
                        <TableCell
                        className={cn(
                            'font-medium',
                            wallet.pnl > 0 ? 'text-green-500' : 'text-red-500'
                        )}
                        >
                        {wallet.pnl > 0 ? '+' : ''}{wallet.pnlPercent}%
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                        10m ago
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <TrackButton walletAddress={wallet.address} />
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenAlertEditor(wallet)}>
                                        <BellPlus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
             {selectedWallet && (
                <CreateAlertDialog 
                    onOpenChange={setIsAlertEditorOpen} 
                    entity={{ type: 'wallet', identifier: selectedWallet.address }}
                />
            )}
        </Dialog>
    )
}
