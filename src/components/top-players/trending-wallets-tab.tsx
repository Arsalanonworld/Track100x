
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, BellPlus } from "lucide-react";
import { TrackButton } from "../track-button";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CreateAlertDialog } from "../create-alert-dialog";
import { useState } from "react";

const mockTrending = [
    { rank: 1, address: '0x456a...7890', volume: '10M', activity: 50 },
    { rank: 2, address: '0xabcd...def0', volume: '8.5M', activity: 120 },
    { rank: 3, address: '0x1a2b...b3c4', volume: '7.2M', activity: 88 },
    { rank: 4, address: '0x5e6f...g7h8', volume: '6.8M', activity: 210 },
    { rank: 5, address: '0x9i0j...k1l2', volume: '6.5M', activity: 75 },
    { rank: 6, address: '0x3m4n...o5p6', volume: '5.9M', activity: 150 },
    { rank: 7, address: '0x7q8r...s9t0', volume: '5.2M', activity: 95 },
    { rank: 8, address: '0x1u2v...w3x4', volume: '4.8M', activity: 300 },
    { rank: 9, address: '0x5y6z...a7b8', volume: '4.5M', activity: 60 },
    { rank: 10, address: '0x9c0d...e1f2', volume: '4.1M', activity: 180 },
];


export default function TrendingWalletsTab() {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null);

    const handleOpenAlertEditor = (address: string) => {
        setSelectedWalletAddress(address);
        setIsAlertEditorOpen(true);
    }

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <div className="space-y-4">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Volume (7d)</TableHead>
                        <TableHead>Activity (7d)</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTrending.map((wallet) => (
                        <TableRow key={wallet.rank}>
                            <TableCell className="font-medium text-lg text-center">
                            #{wallet.rank}
                            </TableCell>
                            <TableCell>
                            <Badge variant="secondary" className="font-mono">
                                {wallet.address}
                            </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                            ${wallet.volume}
                            </TableCell>
                            <TableCell>
                            {wallet.activity} txns
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <TrackButton walletAddress={wallet.address} />
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenAlertEditor(wallet.address)}>
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
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Support Us!</AlertTitle>
                    <AlertDescription>
                    This feature is free. Support us by using our affiliate link to <a href="#" className="font-semibold underline">trade on Binance</a>.
                    </AlertDescription>
                </Alert>
            </div>
            {selectedWalletAddress && (
                <CreateAlertDialog 
                    onOpenChange={setIsAlertEditorOpen} 
                    entity={{ type: 'wallet', identifier: selectedWalletAddress }}
                />
            )}
        </Dialog>
    )
}
