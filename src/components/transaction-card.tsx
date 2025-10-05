
'use client';
import { Card, CardContent } from "@/components/ui/card";
import type { WhaleTransaction } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ArrowRight, Copy, ChevronDown, BellPlus, ArrowDown, Star } from "lucide-react";
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
import { TrackButton } from "./track-button";

interface TransactionCardProps {
    tx: WhaleTransaction;
}

const WalletIdentifier = ({ address, shortAddress, tags, network }: { address: string, shortAddress: string, tags?: string[], network: string }) => (
    <div className="flex items-center gap-2 min-w-0">
        <TrackButton walletAddress={address} />
        <Link
            href={getExplorerUrl(network, address, 'address')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-sm hover:underline truncate"
        >
            {shortAddress}
        </Link>
        <div className="flex items-center gap-1 flex-wrap">
            {tags?.map(tag => <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>)}
        </div>
    </div>
);


const TransactionCard = ({ tx }: { tx: WhaleTransaction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

    const AlertButton = () => (
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative shrink-0" onClick={(e) => { e.stopPropagation(); setIsAlertEditorOpen(true); }} aria-label="Set quick alert">
            <BellPlus className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      </DialogTrigger>
    )

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className="w-full hover:shadow-md transition-shadow duration-200">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    {/* Mobile: Top Row / Desktop: Left Column */}
                                    <div className="flex justify-between items-center md:flex-none md:w-1/4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className='h-10 w-10 text-sm font-bold'>
                                                {tx.token.icon && <AvatarImage src={tx.token.icon} alt={tx.token.symbol} data-ai-hint="token logo" />}
                                                <AvatarFallback>{tx.token.symbol.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="font-bold text-base truncate">{tx.value}</div>
                                                <div className="text-sm text-muted-foreground truncate">{tx.token.symbol}</div>
                                            </div>
                                        </div>
                                         <div className="flex items-center gap-0.5 md:hidden">
                                            <Badge variant="outline">{tx.network}</Badge>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <AlertButton />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Create quick alert</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 data-[state=open]:bg-muted" aria-label="Toggle transaction details">
                                                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile: Middle Area / Desktop: Center Column */}
                                    <div className="flex md:flex-grow md:justify-center items-center gap-2">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
                                            <div className="w-full md:w-auto">
                                                <WalletIdentifier address={tx.from} shortAddress={tx.fromShort} tags={tx.fromTags} network={tx.network} />
                                            </div>

                                            <div className="pl-1 md:pl-0">
                                                <ArrowDown className="h-4 w-4 text-muted-foreground md:hidden" />
                                                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                                            </div>

                                            <div className="w-full md:w-auto">
                                                <WalletIdentifier address={tx.to} shortAddress={tx.toShort} tags={tx.toTags} network={tx.network} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Right column */}
                                    <div className="hidden md:flex items-center justify-end gap-1 sm:gap-2 md:w-1/4">
                                        <Badge variant="outline" className="hidden sm:block">{tx.network}</Badge>
                                        <div className="hidden lg:block text-sm text-muted-foreground whitespace-nowrap">{tx.time}</div>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                               <AlertButton />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Create quick alert</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 data-[state=open]:bg-muted" aria-label="Toggle transaction details">
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <TransactionDetails tx={tx} />
                    </CollapsibleContent>
                </Card>
            </Collapsible>
            {isAlertEditorOpen && <CreateAlertDialog 
                onOpenChange={setIsAlertEditorOpen}
                entity={{
                    type: 'wallet',
                    identifier: tx.from,
                }}
                />}
        </Dialog>
    );
};


const TransactionDetails = ({ tx }: { tx: WhaleTransaction }) => {
    const { toast } = useToast();
    const handleCopy = (text: string, entity: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `${entity} Copied!`, description: text });
    };

    return (
        <div className="p-4 border-t bg-muted/30">
            <div className="space-y-2">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                     <span className="text-sm text-muted-foreground font-semibold">From</span>
                     <div className="flex items-center gap-1">
                        <Link href={getExplorerUrl(tx.network, tx.from, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate">{tx.from}</Link>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(tx.from, "From Address")}><Copy className="h-3 w-3"/></Button>
                     </div>
                </div>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                     <span className="text-sm text-muted-foreground font-semibold">To</span>
                     <div className="flex items-center gap-1">
                        <Link href={getExplorerUrl(tx.network, tx.to, 'address')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate">{tx.to}</Link>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(tx.to, "To Address")}><Copy className="h-3 w-3"/></Button>
                     </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                     <span className="text-sm text-muted-foreground font-semibold">Transaction Hash</span>
                     <div className="flex items-center gap-1">
                        <Link href={getExplorerUrl(tx.network, tx.txHash, 'tx')} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:underline truncate">{tx.txHash}</Link>                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(tx.txHash, "Hash")}><Copy className="h-3 w-3"/></Button>
                     </div>
                </div>
                 <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground font-semibold">Gas Fee</span>
                     <span className="font-mono text-sm">{tx.gasFee}</span>
                </div>
                 <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground font-semibold">Price Impact</span>
                     <span className="font-mono text-sm">{tx.priceImpact}</span>
                </div>
            </div>
        </div>
    );
}


export default TransactionCard;
