
'use client';
import { Card } from "@/components/ui/card";
import type { WhaleTransaction } from "@/lib/mock-data";
import Link from "next/link";
import { Copy, ChevronDown, BellPlus, ArrowUpRight, Wallet2, Hash } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast";
import { getExplorerUrl } from "@/lib/explorers";
import { Dialog } from "./ui/dialog";
import { CreateAlertDialog } from "./create-alert-dialog";
import { WatchlistButton } from "./track-button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { CryptoIcon } from "./crypto-icon";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";


const DetailRow = ({ label, value, network, entityType, tags }: { label: string, value: string, network: string, entityType: 'tx' | 'address', tags?: string[] }) => {
    const { toast } = useToast();
    const handleCopy = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: text });
    };

    return (
        <TableRow>
            <TableCell className="font-medium text-muted-foreground w-[120px]">{label}</TableCell>
            <TableCell>
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate">{value}</p>
                        {tags && tags.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                                {tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-0">
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleCopy(e, value)}>
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={getExplorerUrl(network, value, entityType)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    )
}


const TransactionCard = ({ tx }: { tx: WhaleTransaction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [alertEntity, setAlertEntity] = useState<{type: 'wallet' | 'token', identifier: string} | null>(null);

    const openAlertEditor = (type: 'wallet' | 'token', identifier: string) => {
        setAlertEntity({type, identifier});
        setIsAlertEditorOpen(true);
    };

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className="w-full hover:shadow-lg transition-shadow duration-200 group/card">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                
                                {/* Left Side: Amount & Token */}
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <CryptoIcon token={tx.token.symbol} className="h-10 w-10"/>
                                    <div className="flex-1 sm:flex-initial">
                                        <p className="font-bold text-lg">{tx.value}</p>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <span className="font-semibold">{tx.token.symbol}</span>
                                            <WatchlistButton type="token" identifier={tx.token.symbol} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: From/To Flow */}
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground w-10">From</span>
                                            <Link href={getExplorerUrl(tx.network, tx.from, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline truncate">
                                                {tx.fromShort}
                                            </Link>
                                            {tx.fromTags && tx.fromTags.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-1">
                                                    {tx.fromTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground w-10">To</span>
                                             <Link href={getExplorerUrl(tx.network, tx.to, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline truncate">
                                                {tx.toShort}
                                            </Link>
                                             {tx.toTags && tx.toTags.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-1">
                                                    {tx.toTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions and Details Toggle */}
                                <div className="flex items-center self-end sm:self-center justify-end gap-1 sm:gap-2">
                                    <Badge variant="outline" className="hidden xs:inline-flex">{tx.network}</Badge>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{tx.time}</span>
                                    
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                <BellPlus className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuLabel>Create Alert For</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openAlertEditor('token', tx.token.symbol)}>Token: {tx.token.symbol}</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openAlertEditor('wallet', tx.from)}>Sender: {tx.fromShort}</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openAlertEditor('wallet', tx.to)}>Receiver: {tx.toShort}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 data-[state=open]:bg-muted" aria-label="Toggle transaction details">
                                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       <div className="px-4 pb-4">
                           <Table>
                               <TableBody>
                                   <DetailRow label="Sender" value={tx.from} network={tx.network} entityType="address" tags={tx.fromTags} />
                                   <DetailRow label="Receiver" value={tx.to} network={tx.network} entityType="address" tags={tx.toTags} />
                                   <DetailRow label="Transaction Hash" value={tx.txHash} network={tx.network} entityType="tx" />
                               </TableBody>
                           </Table>
                        </div>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
            {isAlertEditorOpen && alertEntity && (
                <CreateAlertDialog 
                    onOpenChange={setIsAlertEditorOpen}
                    entity={alertEntity}
                />
            )}
        </Dialog>
    );
};


export default TransactionCard;

