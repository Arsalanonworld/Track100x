
'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
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
import { Search, Filter, ChevronsUpDown } from 'lucide-react';
import { mockWhaleTxs } from '@/lib/mock-data';
import { Button } from './ui/button';
import TransactionCard from './transaction-card';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useUser } from '@/firebase';
import { AdCard } from './ad-card';

export function WhaleFeed() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenFilter, setTokenFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';

  const transactionsPerPage = 10;
  

  const handleNextPage = () => {
    if (currentPage * transactionsPerPage < mockWhaleTxs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredTransactions = useMemo(() => {
    let transactions = mockWhaleTxs;
    if(tokenFilter) {
      transactions = transactions.filter(tx => tx.token.symbol.toLowerCase().includes(tokenFilter.toLowerCase()));
    }
    if(chainFilter !== 'all') {
      transactions = transactions.filter(tx => tx.network.toLowerCase() === chainFilter);
    }
    if(typeFilter !== 'all') {
       transactions = transactions.filter(tx => tx.type.toLowerCase() === typeFilter);
    }
    return transactions;
  }, [tokenFilter, chainFilter, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  const currentTransactions = useMemo(() => {
     return filteredTransactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
      )
  }, [filteredTransactions, currentPage]);


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


  return (
        <Card className="border-x-0 sm:border-x">
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="flex-1 whitespace-nowrap">Live Whale Transactions</CardTitle>
                  
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
                          <Collapsible className="py-4">
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

                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((tx, index) => (
                        <React.Fragment key={tx.id}>
                          <TransactionCard tx={tx} />
                          {!isPro && index === 3 && <AdCard />}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="text-center py-16 text-muted-foreground">
                        <p className="text-lg font-semibold">No transactions found.</p>
                        <p>Try adjusting your search or category filters.</p>
                      </div>
                    )}
                </div>
                {filteredTransactions.length > transactionsPerPage && <PaginationControls />}
            </CardContent>
        </Card>
  );
}
