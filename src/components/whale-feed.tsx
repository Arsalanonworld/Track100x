
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
import { Search, Filter } from 'lucide-react';
import { mockWhaleTxs } from '@/lib/mock-data';
import { Button } from './ui/button';
import TransactionCard from './transaction-card';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export function WhaleFeed() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenFilter, setTokenFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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
          onChange={(e) => setTokenFilter(e.target.value)}
        />
      </div>
      <Select 
        value={chainFilter} 
        onValueChange={setChainFilter}
      >
        <SelectTrigger className="w-full">
          <div className="flex justify-between items-center w-full">
            <SelectValue placeholder="All Chains" />
          </div>
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
        onValueChange={setTypeFilter}
      >
        <SelectTrigger className="w-full">
           <div className="flex justify-between items-center w-full">
              <SelectValue placeholder="All Types" />
           </div>
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
                           <Button variant="outline" size="icon">
                             <Filter className="h-4 w-4" />
                           </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom">
                          <SheetHeader>
                            <SheetTitle>Filter Transactions</SheetTitle>
                            <SheetDescription>
                              Refine the whale feed to find what you're looking for.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                            <FilterControls />
                          </div>
                        </SheetContent>
                      </Sheet>
                  </div>

                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {currentTransactions.map((tx) => (
                       <TransactionCard key={tx.id} tx={tx} />
                    ))}
                </div>
                <PaginationControls />
            </CardContent>
        </Card>
  );
}
