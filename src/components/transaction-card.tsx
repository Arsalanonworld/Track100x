
'use client';
import { Card } from "@/components/ui/card";
import type { WhaleTransaction } from "@/lib/mock-data";
import Link from "next/link";
import { Copy, ChevronDown, BellPlus, ArrowUpRight, ArrowRight } from "lucide-react";
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
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AlertEditorDialog } from "@/components/alert-editor-dialog";
import { WatchlistButton } from "./track-button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { CryptoIcon } from "./crypto-icon";

const DetailItem = ({ label, value, network, entityType }: { label: string; value: string; network: string; entityType: "tx" | "address" }) => {
    const { toast } = useToast();

    const handleCopy = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: text });
    };

    return (
        <div className="group/detail-item grid grid-cols-[80px_1fr] items-center gap-4">
            <span className="text-sm text-muted-foreground text-right">{label}</span>
            <div className="flex items-center justify-between">
                 <Link href={getExplorerUrl(network, value, entityType)} target="_blank" rel="noopener noreferrer" className="font-mono text-sm truncate hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    {value}
                </Link>
                <div className="flex items-center opacity-0 group-hover/detail-item:opacity-100 transition-opacity">
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
        </div>
    );
};


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
                <Card className="w-full hover:shadow-lg transition-shadow duration-200 group/card overflow-hidden">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Left Side: Amount & Token */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <CryptoIcon token={tx.token.symbol} className="h-10 w-10"/>
                                    <div>
                                        <p className="font-bold text-lg">{tx.tokenAmount}</p>
                                        <p className="text-sm text-muted-foreground">{tx.value}</p>
                                    </div>
                                </div>

                                {/* Center: From/To Flow */}
                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                        {/* From */}
                                        <div className="flex items-center gap-2 text-sm w-full md:max-w-xs">
                                            <span className="text-muted-foreground w-10 hidden md:inline">From</span>
                                            <Link href={getExplorerUrl(tx.network, tx.from, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline truncate">
                                                {tx.fromShort}
                                            </Link>
                                            <WatchlistButton type="wallet" identifier={tx.from} />
                                            {tx.fromTags && tx.fromTags.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    {tx.fromTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block shrink-0" />
                                        
                                        {/* To */}
                                        <div className="flex items-center gap-2 text-sm w-full md:max-w-xs">
                                            <span className="text-muted-foreground w-10 hidden md:inline">To</span>
                                             <Link href={getExplorerUrl(tx.network, tx.to, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline truncate">
                                                {tx.toShort}
                                            </Link>
                                            <WatchlistButton type="wallet" identifier={tx.to} />
                                             {tx.toTags && tx.toTags.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    {tx.toTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions and Details Toggle */}
                                <div className="flex items-center self-start sm:self-center justify-end gap-1 sm:gap-2 w-full sm:w-auto">
                                    <Badge variant="outline" className="hidden xs:inline-flex">{tx.network}</Badge>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto sm:ml-0">{tx.time}</span>
                                    
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                <BellPlus className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuLabel>Create Quick Alert For</DropdownMenuLabel>
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
                       <div className="p-4 border-t bg-muted/30 space-y-3">
                           <DetailItem label="Sender" value={tx.from} network={tx.network} entityType="address" />
                           <DetailItem label="Receiver" value={tx.to} network={tx.network} entityType="address" />
                           <DetailItem label="Tx Hash" value={tx.txHash} network={tx.network} entityType="tx" />
                        </div>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
            {isAlertEditorOpen && alertEntity && (
                <AlertEditorDialog 
                    onOpenChange={setIsAlertEditorOpen}
                    entity={alertEntity}
                    forceQuick={true}
                />
            )}
        </Dialog>
    );
};


export default TransactionCard;

    