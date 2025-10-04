
'use client';
import React, { useState } from 'react';
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
import { RefreshCw, Search } from 'lucide-react';
import { mockWhaleTxs } from '@/lib/mock-data';
import { Button } from './ui/button';
import TransactionCard from './transaction-card';


export function WhaleFeed() {
  const [currentPage, setCurrentPage] = useState(1);
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

  const currentTransactions = mockWhaleTxs.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );


  return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <CardTitle>Live Whale Transactions</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter by token..." className="pl-10 w-full sm:w-[180px]" />
                    </div>
                    <Select>
                    <SelectTrigger className="w-full sm:w-[160px]">
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
                    <Select>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="swap">Swap</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {currentTransactions.map((tx) => (
                       <TransactionCard key={tx.id} tx={tx} />
                    ))}
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button 
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {Math.ceil(mockWhaleTxs.length / transactionsPerPage)}
                    </span>
                    <Button 
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage * transactionsPerPage >= mockWhaleTxs.length}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
  );
}
