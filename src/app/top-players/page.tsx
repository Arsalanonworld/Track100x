
'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { topPlayersData, Player } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellPlus, Search, Trophy, ArrowUpRight, Percent, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrackButton } from '@/components/track-button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateAlertDialog } from '@/components/create-alert-dialog';
import { cn } from '@/lib/utils';


const allTags = Array.from(new Set(topPlayersData.flatMap(p => p.tags)));

const TopPlayerRow = ({ player, rank }: { player: Player; rank: number }) => {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <TableRow>
                <TableCell className="font-medium text-muted-foreground text-center">{rank}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold text-primary">{player.alias}</span>
                        <span className="font-mono text-xs text-muted-foreground">{player.address}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {player.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        {player.tags.length === 0 && <Badge variant="outline">N/A</Badge>}
                    </div>
                </TableCell>
                <TableCell className="text-right font-medium">${(player.netWorth / 1_000_000).toFixed(2)}M</TableCell>
                 <TableCell className={cn("text-right font-medium", player.pnlPercent > 0 ? "text-green-500" : "text-red-500")}>
                    {player.pnlPercent > 0 ? '+' : ''}{player.pnlPercent.toFixed(1)}%
                </TableCell>
                 <TableCell className="text-right font-medium">{player.winRate}%</TableCell>
                <TableCell>
                    <div className="flex items-center justify-end gap-1">
                        <TrackButton walletAddress={player.address} />
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAlertEditorOpen(true)}>
                                <BellPlus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </div>
                </TableCell>
            </TableRow>
             {isAlertEditorOpen && <CreateAlertDialog 
                onOpenChange={setIsAlertEditorOpen} 
                entity={{ type: 'wallet', identifier: player.address }}
            />}
        </Dialog>
    )
}


export default function TopPlayersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChain, setSelectedChain] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [sortBy, setSortBy] = useState('netWorth');

    const filteredAndSortedPlayers = useMemo(() => {
        let players = [...topPlayersData];

        // Filter by search term (alias or address)
        if (searchTerm) {
            players = players.filter(p => 
                p.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by chain
        if (selectedChain !== 'all') {
            players = players.filter(p => p.blockchain.toLowerCase() === selectedChain);
        }

        // Filter by tag
        if (selectedTag !== 'all') {
            players = players.filter(p => p.tags.includes(selectedTag));
        }

        // Sort players
        players.sort((a, b) => {
            switch (sortBy) {
                case 'pnlPercent':
                    return b.pnlPercent - a.pnlPercent;
                case 'winRate':
                    return b.winRate - a.winRate;
                case 'netWorth':
                default:
                    return b.netWorth - a.netWorth;
            }
        });
        
        return players;
    }, [searchTerm, selectedChain, selectedTag, sortBy]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Top Players"
        description="Discover and track the most influential wallets and skilled traders in crypto."
      />

      {/* Filter and Sort Controls */}
      <div className="p-4 bg-card border rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by alias or address..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger><SelectValue placeholder="All Chains" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger><SelectValue placeholder="All Tags" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Sort by..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="netWorth">Sort by: Net Worth</SelectItem>
                    <SelectItem value="pnlPercent">Sort by: 7d P&L %</SelectItem>
                    <SelectItem value="winRate">Sort by: Win Rate</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {/* Player Table */}
      <Card>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-center'>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className='text-right'>Net Worth</TableHead>
                    <TableHead className='text-right'>7d P&L</TableHead>
                    <TableHead className='text-right'>Win Rate</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAndSortedPlayers.map((player, index) => (
                    <TopPlayerRow key={player.id} player={player} rank={index + 1} />
                ))}
            </TableBody>
        </Table>
      </Card>

       {filteredAndSortedPlayers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
              <p className="text-lg font-semibold">No players found.</p>
              <p>Try adjusting your search or category filters.</p>
          </div>
      )}

    </div>
  );
}
