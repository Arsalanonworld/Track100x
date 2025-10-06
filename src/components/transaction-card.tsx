
'use client';
import { Card, CardContent } from "@/components/ui/card";
import type { WhaleTransaction } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ArrowRight, Copy, ChevronDown, BellPlus, Tag } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateAlertDialog } from "./create-alert-dialog";
import { WatchlistButton } from "./track-button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";

interface TransactionCardProps {
    tx: WhaleTransaction;
}

const WalletIdentifier = ({ address, shortAddress, tags, network, label }: { address: string, shortAddress: string, tags?: string[], network: string, label: string }) => {
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
                <Card className="w-full hover:shadow-md transition-shadow duration-200">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                                    {/* --- Left Column (Token Info) --- */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className='h-10 w-10 text-sm font-bold'>
                                            {tx.token.icon && <AvatarImage src={tx.token.icon} alt={tx.token.symbol} data-ai-hint="token logo" />}
                                            <AvatarFallback>{tx.token.symbol.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-bold text-base truncate">{tx.value}</div>
                                            <div className="text-sm text-muted-foreground truncate flex items-center">
                                                <span>{tx.token.symbol}</span>
                                                <WatchlistButton type="token" identifier={tx.token.symbol} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* --- Center Column (From/To) --- */}
                                     <div className="flex-grow flex items-center gap-2 pl-1 sm:pl-0 sm:justify-center">
                                       <div className="font-mono text-sm flex items-center gap-2 truncate">
                                           <WatchlistButton type="wallet" identifier={tx.from} />
                                           <Link href={getExplorerUrl(tx.network, tx.from, 'address')} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary truncate">{tx.fromShort}</Link>
                                           <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                           <WatchlistButton type="wallet" identifier={tx.to} />
                                           <Link href={getExplorerUrl(tx.network, tx.to, 'address')} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary truncate">{tx.toShort}</Link>
                                       </div>
                                    </div>

                                    {/* --- Right Column (Actions) --- */}
                                    <div className="flex items-center self-end xs:self-center justify-end gap-1 sm:gap-2">
                                        <Badge variant="outline" className="text-xs">{tx.network}</Badge>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">{tx.time}</div>
                                        
                                        <DropdownMenu>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 relative shrink-0" onClick={(e) => e.stopPropagation()} aria-label="Set alert">
                                                                <BellPlus className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>Create alert</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenuItem onClick={() => openAlertEditor('token', tx.token.symbol)}>
                                                    Alert for Token: {tx.token.symbol}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => openAlertEditor('wallet', tx.from)}>
                                                    Alert for Sender: {tx.fromShort}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openAlertEditor('wallet', tx.to)}>
                                                    Alert for Receiver: {tx.toShort}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 data-[state=open]:bg-muted" aria-label="Toggle transaction details">
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       <div className="p-4 border-t bg-muted/30">
                            <div className="space-y-2">
                                <WalletIdentifier address={tx.from} shortAddress={tx.fromShort} tags={tx.fromTags} network={tx.network} label="From" />
                                <WalletIdentifier address={tx.to} shortAddress={tx.toShort} tags={tx.toTags} network={tx.network} label="To" />
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
