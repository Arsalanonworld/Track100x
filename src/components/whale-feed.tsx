
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { Search, Filter, ChevronsUpDown, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import TransactionCard from './transaction-card';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import type { WhaleTransaction } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';


function PageSkeleton({ showTitle }: { showTitle: boolean }) {
    return (
        <div className='space-y-8'>
            {showTitle && (
              <div className='flex justify-between items-center'>
                  <div className="flex-1">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-5 w-2/3 mt-2" />
                  </div>
                  <div className="hidden md:flex gap-2">
                      <Skeleton className="h-10 w-48" />
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="md:hidden">
                      <Skeleton className="h-10 w-28" />
                  </div>
              </div>
            )}
            <Card>
                <CardContent className="space-y-3 pt-6">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="w-full p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3 shrink-0">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div>
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-4 w-16 mt-1" />
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                        <Skeleton className="h-6 w-full md:max-w-xs" />
                                        <Skeleton className="h-6 w-full md:max-w-xs" />
                                    </div>
                                </div>
                                <div className="flex items-center self-start sm:self-center justify-end gap-1 sm:gap-2 w-full sm:w-auto">
                                    <Skeleton className="h-6 w-16 hidden xs:inline-flex" />
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}


export function WhaleFeed({ isPreview = false, showTitle = true }: { isPreview?: boolean, showTitle?: boolean }) {
  
  const [allTransactions, setAllTransactions] = useState<WhaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [tokenFilter, setTokenFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const transactionsPerPage = isPreview ? 5 : 10;
  
  // API Call & Live Feed Simulation
  useEffect(() => {
    async function fetchTransactions() {
        setLoading(true);
        try {
            const response = await fetch('/api/whale-feed');
            const data = await response.json();
            
            const initialData = isPreview ? data.slice(0, 5) : data.slice(0,10);
            setAllTransactions(initialData.map((tx: any) => ({ ...tx, id: `${tx.id}-${Math.random()}` })));


        } catch (error) {
            console.error("Failed to fetch whale feed data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchTransactions();

    if (isPreview) return;

    // Live feed simulation
    const interval = setInterval(async () => {
        try {
            const response = await fetch('/api/whale-feed');
            const data = await response.json();
            // Get a random transaction to simulate a new one
            const newTransaction = data[Math.floor(Math.random() * data.length)];
             setAllTransactions(prevTransactions => [
                {...newTransaction, id: `${newTransaction.id}-${Date.now()}`},
                ...prevTransactions
            ]);
        } catch (error) {
            console.error("Failed to fetch new transaction:", error);
        }
    }, 4000); // Add a new transaction every 4 seconds

    return () => clearInterval(interval);
}, [isPreview]);


  const handleNextPage = () => {
    if (currentPage * transactionsPerPage < filteredTransactions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredTransactions = useMemo(() => {
    let txs = allTransactions;
    if(tokenFilter) {
      txs = txs.filter(tx => tx.token.symbol.toLowerCase().includes(tokenFilter.toLowerCase()));
    }
    if(chainFilter !== 'all') {
      txs = txs.filter(tx => tx.network.toLowerCase() === chainFilter);
    }
    if(typeFilter !== 'all') {
       txs = txs.filter(tx => tx.type.toLowerCase() === typeFilter);
    }
    return txs;
  }, [allTransactions, tokenFilter, chainFilter, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  const currentTransactions = useMemo(() => {
     const dataToPaginate = isPreview ? filteredTransactions.slice(0,5) : filteredTransactions;
     if (isPreview) return dataToPaginate;

     return dataToPaginate.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
      )
  }, [filteredTransactions, currentPage, transactionsPerPage, isPreview]);


  const FilterControls = () => (
    <>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Filter by token..." 
          className="pl-10 w-full" 
          value={tokenFilter}
          onChange={(e) => {
            setTokenFilter(e.target.value);
            setCurrentPage(1); // Reset to first page on filter change
          }}
        />
      </div>
      <Select 
        value={chainFilter} 
        onValueChange={(value) => {
          setChainFilter(value);
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Chains" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Chains</SelectItem>
          <SelectItem value="ethereum">Ethereum</SelectItem>
          <SelectItem value="solana">Solana</SelectItem>
          <SelectItem value="bitcoin">Bitcoin</SelectItem>
          <SelectItem value="polygon">Polygon</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={typeFilter}
        onValueChange={(value) => {
          setTypeFilter(value);
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="w-full">
           <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
          <SelectItem value="swap">Swap</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  const PaginationControls = () => {
    return (
     <div className="flex justify-center items-center gap-4 mt-6">
        <Button 
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
        >
            Previous
        </Button>
        <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
        </span>
        <Button 
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
        >
            Next
        </Button>
    </div>
  )};


  if (loading && allTransactions.length === 0) {
    return <PageSkeleton showTitle={showTitle} />;
  }

  return (
        <Card>
            {showTitle && (
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <CardTitle>Real-Time Whale Feed</CardTitle>
                        <CardDescription>A live stream of significant on-chain transactions.</CardDescription>
                    </div>
                    
                    {!isPreview && (
                        <>
                        {/* Desktop Filters */}
                        <div className="hidden md:flex flex-row gap-2 w-full max-w-lg items-center">
                            <FilterControls />
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="md:hidden w-full flex justify-end">
                            <Sheet>
                                <SheetTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="rounded-t-lg">
                                <SheetHeader className="text-left">
                                    <SheetTitle>Filter Transactions</SheetTitle>
                                    <SheetDescription>
                                    Refine the whale feed to find what you're looking for.
                                    </SheetDescription>
                                </SheetHeader>
                                <Collapsible className="py-4" defaultOpen={true}>
                                    <CollapsibleTrigger className="flex justify-between w-full font-semibold text-sm items-center pb-2 border-b">
                                    <span>Show Filters</span>
                                    <ChevronsUpDown className="h-4 w-4"/>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                    <div className="grid grid-cols-1 gap-4 pt-4">
                                        <FilterControls />
                                    </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                </SheetContent>
                            </Sheet>
                        </div>
                        </>
                    )}
                    </div>
                </CardHeader>
            )}
            <CardContent className={cn(!showTitle && "pt-6")}>
                <div className="space-y-3">
                    {loading && currentTransactions.length === 0 ? (
                       [...Array(isPreview ? 5 : 10)].map((_, i) => <PageSkeleton key={i} showTitle={false} />)
                    ) : currentTransactions.length > 0 ? (
                      <AnimatePresence initial={false}>
                        {currentTransactions.map((tx) => (
                           <motion.div
                            key={tx.id}
                            layout
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, layout: { duration: 0.3 } } }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="bg-card origin-top"
                          >
                             <div className="animate-pulse-slow">
                               <TransactionCard tx={tx} />
                             </div>
                           </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-16 text-muted-foreground">
                        <p className="text-lg font-semibold">No transactions found.</p>
                        <p>Try adjusting your search or category filters.</p>
                      </div>
                    )}
                </div>
                {isPreview && !loading && allTransactions.length > 0 && (
                    <div className="text-center mt-6">
                        <Button asChild variant="outline">
                           <Link href="/feed">View full feed <ArrowRight className="h-4 w-4 ml-2" /></Link>
                        </Button>
                    </div>
                )}
                {!isPreview && !loading && filteredTransactions.length > transactionsPerPage && <PaginationControls />}
            </CardContent>
        </Card>
  );
}
