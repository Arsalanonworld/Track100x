
'use client';
import { Card, CardContent } from "@/components/ui/card";
import type { WhaleTransaction } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ArrowRight, Copy, ChevronDown, BellPlus, Wallet2 } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateAlertDialog } from "./create-alert-dialog";
import { WatchlistButton } from "./track-button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { CryptoIcon } from "./crypto-icon";

interface TransactionCardProps {
    tx: WhaleTransaction;
}

const WalletIdentifierDetails = ({ address, shortAddress, tags, network, label }: { address: string, shortAddress: string, tags?: string[], network: string, label: string }) => {
    const { toast } = useToast();
    const handleCopy = (text: string, entity: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `${entity} Copied!`, description: text });
    };
    
    return (
     <div className="space-y-1">
         <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-semibold w-12">{label}</span>
            <Link href={getExplorerUrl(network, address, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate">{address}</Link>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(address, `${label} Address`)}><Copy className="h-3 w-3"/></Button>
         </div>
         {tags && tags.length > 0 && (
             <div className="flex items-center gap-1 pl-14">
                {tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>)}
            </div>
         )}
    </div>
)};

const WalletPill = ({ address, shortAddress, tags, network, onAlertClick }: { address: string, shortAddress: string, tags?: string[], network: string, onAlertClick: () => void}) => (
    <div className="relative group flex-1 bg-muted/40 hover:bg-muted/80 transition-colors rounded-lg p-3 min-w-0">
        <div className="flex items-center gap-2">
            <Wallet2 className="h-5 w-5 text-muted-foreground shrink-0"/>
            <div className="flex-1 min-w-0">
                <Link href={getExplorerUrl(network, address, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate block">{shortAddress}</Link>
                {tags && tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                        {tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>)}
                    </div>
                )}
            </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <WatchlistButton type="wallet" identifier={address} />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onAlertClick(); }}>
                            <BellPlus className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create Alert</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>
);


const TransactionCard = ({ tx }: { tx: WhaleTransaction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [alertEntity, setAlertEntity] = useState<{type: 'wallet' | 'token', identifier: string} | null>(null);

    const handleCopy = (text: string, entity: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `${entity} Copied!`, description: text });
    };

    const openAlertEditor = (type: 'wallet' | 'token', identifier: string) => {
        setAlertEntity({type, identifier});
        setIsAlertEditorOpen(true);
    };

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className="w-full hover:shadow-lg transition-shadow duration-200 group/card">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    {/* From Wallet */}
                                    <WalletPill address={tx.from} shortAddress={tx.fromShort} tags={tx.fromTags} network={tx.network} onAlertClick={() => openAlertEditor('wallet', tx.from)} />

                                    {/* Center Amount */}
                                    <div className="flex-shrink-0 group-hover/card:scale-110 transition-transform duration-300 ease-in-out p-2">
                                        <div className="flex flex-col items-center">
                                            <CryptoIcon token={tx.token.symbol} className="h-8 w-8 mb-1"/>
                                            <p className="font-bold text-base whitespace-nowrap">{tx.value}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <span>{tx.token.symbol}</span>
                                                <WatchlistButton type="token" identifier={tx.token.symbol} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block p-1 bg-muted rounded-full group-hover/card:bg-primary transition-colors">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/card:text-primary-foreground"/>
                                    </div>
                                     <div className="sm:hidden p-1 bg-muted rounded-full group-hover/card:bg-primary transition-colors -rotate-90">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/card:text-primary-foreground"/>
                                    </div>

                                    {/* To Wallet */}
                                    <WalletPill address={tx.to} shortAddress={tx.toShort} tags={tx.toTags} network={tx.network} onAlertClick={() => openAlertEditor('wallet', tx.to)} />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
                                    <Badge variant="outline" className="text-xs">{tx.network}</Badge>
                                    <span>{tx.time}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 data-[state=open]:bg-muted" aria-label="Toggle transaction details">
                                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                    </Button>
                                </div>
                            </CardContent>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       <div className="p-4 border-t bg-muted/30">
                            <div className="space-y-2">
                                <WalletIdentifierDetails address={tx.from} shortAddress={tx.fromShort} tags={tx.fromTags} network={tx.network} label="From" />
                                <WalletIdentifierDetails address={tx.to} shortAddress={tx.toShort} tags={tx.toTags} network={tx.network} label="To" />
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="text-sm text-muted-foreground font-semibold w-12">Tx Hash</span>
                                    <Link href={getExplorerUrl(tx.network, tx.txHash, 'tx')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate">{tx.txHash}</Link>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(tx.txHash, "Hash")}><Copy className="h-3 w-3"/></Button>
                                </div>
                            </div>
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

