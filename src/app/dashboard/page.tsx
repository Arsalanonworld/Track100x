
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Trash2, BellPlus, Pencil, Check, X, Wallet, Eye, Download, Lock } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { WatchlistItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FeatureLock } from '@/components/feature-lock';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CryptoIcon } from '@/components/crypto-icon';
import { getExplorerUrl } from '@/lib/explorers';
import { WatchlistActionForm } from '@/components/watchlist/watchlist-action-form';
import { tokenLibrary } from '@/lib/tokens';
import { AlertsPanel } from '@/components/watchlist/alerts-panel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HoldingsTable } from '@/components/dashboard/holdings-table';


const WATCHLIST_LIMIT_FREE = 5;

const portfolioData = {
  netWorth: 125834.54,
  change24h: 2.5,
  history: {
    '7d': [
      { name: '7d ago', value: 124000 },
      { name: 'Today', value: 125834.54 },
    ],
    '30d': [
        { name: '30d ago', value: 115000 },
        { name: '20d ago', value: 118000 },
        { name: '10d ago', value: 112000 },
        { name: 'Today', value: 125834.54 },
    ],
    'all': [
        { name: '90d ago', value: 95000 },
        { name: '60d ago', value: 110000 },
        { name: '30d ago', value: 115000 },
        { name: 'Today', value: 125834.54 },
    ]
  },
};

const PnlBadge = ({ value }: { value: number }) => (
  <Badge variant={value >= 0 ? "secondary" : "destructive"} className={cn(
    value >= 0 ? 'text-green-500' : 'text-red-500',
    'bg-opacity-20 border-opacity-30'
  )}>
    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
  </Badge>
);


function WatchlistItemCard({ item, onUpdate, onRemove }: { item: WatchlistItem, onUpdate: (id: string, name: string) => void, onRemove: (item: WatchlistItem) => void}) {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(item.name || '');

    const handleStartEditing = () => {
        setNewName(item.name || '');
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        onUpdate(item.id, newName);
        setIsEditing(false);
    };
    
    if (!item.identifier) return null;

    const currentToken = tokenLibrary[item.identifier.toUpperCase()];

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <Card className='group'>
                <CardContent className='p-4'>
                    <div className='flex items-start gap-4'>
                        {/* Icon */}
                        <div className='mt-1'>
                            {item.type === 'wallet' ? <Wallet className="h-6 w-6 text-muted-foreground"/> : <CryptoIcon token={item.identifier} className="h-6 w-6"/>}
                        </div>

                        {/* Main Content */}
                        <div className='flex-1 space-y-2 min-w-0'>
                           {item.type === 'wallet' ? (
                                <>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={newName} 
                                            onChange={e => setNewName(e.target.value)} 
                                            placeholder='Set an alias' 
                                            className="h-9"
                                        />
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-9 w-9 text-green-500 hover:text-green-600">
                                            <Check className='h-5 w-5'/>
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={handleCancelEditing} className="h-9 w-9 text-red-500 hover:text-red-600">
                                            <X className='h-5 w-5'/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-1'>
                                        <h3 className='text-lg font-semibold truncate'>
                                            {item.name || item.identifier}
                                        </h3>
                                        <Button size="icon" variant="ghost" className='h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity' onClick={handleStartEditing}><Pencil className='h-4 w-4'/></Button>
                                    </div>
                                )}
                                {item.name && (
                                    <Link href={getExplorerUrl('ethereum', item.identifier, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-block truncate max-w-full'>
                                        {item.identifier}
                                    </Link>
                                )}
                                 <div className='text-xs text-muted-foreground pt-1'>
                                    <p>Net Worth & P/L: <span className='italic'>Fetching data...</span></p>
                                 </div>
                                </>
                           ) : (
                                <div>
                                    <h3 className='text-lg font-semibold truncate'>
                                        {currentToken?.name || item.name || item.identifier}
                                    </h3>
                                    <p className="font-mono text-sm text-muted-foreground">{item.identifier.toUpperCase()}</p>
                                </div>
                           )}
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1'>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setIsAlertEditorOpen(true)}>
                                    <BellPlus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/5 h-9 w-9">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove <span className='font-mono bg-muted p-1 rounded-sm'>{item.name || item.identifier}</span> from your watchlist and delete any associated alerts.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onRemove(item)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
             {isAlertEditorOpen && (
                <AlertEditorDialog 
                    onOpenChange={setIsAlertEditorOpen} 
                    entity={{ type: item.type, identifier: item.identifier }}
                />
            )}
        </Dialog>
    )
}

function WatchlistSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-8 w-8 rounded-full mt-1" />
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-10 w-32 mx-auto" />
                </CardContent>
            </Card>
        </div>
    )
}

function EmptyDashboardState() {
    return (
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Wallet className="h-10 w-10 mx-auto mb-4" />
                <h3 className='text-xl font-semibold text-foreground'>Your Dashboard is Empty</h3>
                <p>Add wallets or tokens to your watchlist to see your portfolio overview, analytics, and alerts.</p>
                <div className="mt-4">
                    <p className="text-sm">Use the form below to get started.</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const { user, loading: userLoading, claims } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorEntity, setEditorEntity] = useState<{type: 'wallet' | 'token', identifier: string} | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore, refreshKey]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const wallets = useMemo(() => watchlist?.filter(item => item.type === 'wallet') || [], [watchlist]);
  
  const isLoading = userLoading || (user && watchlistLoading);

  const watchlistAtLimit = !isPro && watchlist && watchlist.length >= WATCHLIST_LIMIT_FREE;
  const hasWallets = wallets.length > 0;

  React.useEffect(() => {
    if (!isLoading && !isPro) {
      setTimeRange('7d');
    }
  }, [isLoading, isPro]);
  
  const chartData = portfolioData.history[timeRange] || portfolioData.history['7d'];

  const handleRemove = (item: WatchlistItem) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, item.id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: `${item.type === 'wallet' ? 'Wallet' : 'Token'} Removed`,
            description: `${item.name || item.identifier} removed from your watchlist.`
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }
  
  const handleUpdate = (id: string, name: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/watchlist`, id);
    updateDoc(docRef, { name })
      .then(() => {
        toast({ title: 'Alias Updated', description: `Item alias has been updated.` });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { name },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const handleOpenEditor = (entity?: {type: 'wallet' | 'token', identifier: string}) => {
    setEditorEntity(entity);
    setIsEditorOpen(true);
  }
  
  const handleItemAdded = () => {
    setRefreshKey(prev => prev + 1);
  }

  const pageDescription = isPro
    ? 'Track your wallets, tokens, and alerts all in one place.'
    : `You are on the Free plan. Upgrade to unlock all features.`;
  
  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <div className="space-y-8">
                <PageHeader
                    title="My Dashboard"
                    description={pageDescription}
                    action={
                        <Button variant="outline" disabled={!isPro || !hasWallets}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                            {!isPro && <Lock className="ml-2 h-3 w-3" />}
                        </Button>
                    }
                />

                {!hasWallets && !isLoading ? (
                  <EmptyDashboardState />
                ) : (
                  <>
                  {/* Section 1: Portfolio Overview */}
                  <section id="overview">
                    <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Overview</CardTitle>
                          <CardDescription>Aggregated view of your on-chain wealth from your watched wallets.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          {/* Net Worth and Time Selector */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Net Worth</p>
                              <p className="text-4xl font-bold">${portfolioData.netWorth.toLocaleString()}</p>
                              <PnlBadge value={portfolioData.change24h} />
                            </div>
                            <Select value={timeRange} onValueChange={(val) => setTimeRange(val as '7d' | '30d' | 'all')}>
                              <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select time range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d" disabled={!isPro}>
                                  <div className="flex items-center gap-2">Last 30 Days {!isPro && <Lock className='h-3 w-3' />}</div>
                                </SelectItem>
                                <SelectItem value="all" disabled={!isPro}>
                                  <div className="flex items-center gap-2">All Time {!isPro && <Lock className='h-3 w-3' />}</div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Main Chart */}
                          <div className="h-[350px]">
                              <ChartContainer config={{value: {label: 'Net Worth', color: 'hsl(var(--primary))'}}} className='h-full w-full'>
                                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                                      <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                                      <Tooltip
                                          cursor={{ stroke: 'hsl(var(--border))' }}
                                          content={({ active, payload, label }) => active && payload && payload.length && (
                                              <ChartTooltipContent
                                                label={label}
                                                payload={payload.map((p) => ({
                                                    ...p,
                                                    value: (p.value as number).toLocaleString('en-US', {
                                                      style: 'currency',
                                                      currency: 'USD',
                                                      minimumFractionDigits: 0,
                                                      maximumFractionDigits: 0,
                                                    })
                                                }))}
                                              />
                                          )}
                                      />
                                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                                  </AreaChart>
                              </ChartContainer>
                          </div>
                        </CardContent>
                      </Card>
                  </section>
                   <section id="token-holdings">
                        <HoldingsTable />
                    </section>
                  </>
                )}

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8'>
                    <div className='lg:col-span-2 space-y-6'>
                         <h2 className='text-2xl font-bold tracking-tight'>Watchlist</h2>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <WatchlistActionForm 
                                user={user}
                                onItemAdded={handleItemAdded}
                                onAlertCreate={handleOpenEditor}
                                atLimit={!!watchlistAtLimit}
                                isLoading={isLoading}
                             />
                        </div>
                        
                        {watchlistAtLimit && (
                            <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                                <Lock className="w-8 h-8 text-primary mx-auto" />
                                <h3 className="text-2xl font-bold">Watchlist Limit Reached</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    You've reached the limit of ${WATCHLIST_LIMIT_FREE} items for the Free plan. Upgrade to track unlimited wallets and tokens.
                                </p>
                                <Button asChild>
                                    <Link href="/upgrade">Upgrade to Pro</Link>
                                </Button>
                            </Card>
                        )}
                        
                        <div className="space-y-4">
                           
                            {isLoading ? <WatchlistSkeleton /> : user && watchlist && watchlist.length > 0 ? (
                                watchlist.map((item) => (
                                   <WatchlistItemCard key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
                                ))
                            ) : (
                               !isLoading && (
                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                                    <Eye className="h-10 w-10 mb-4" />
                                    <p className="font-semibold text-lg">Your watchlist is empty.</p>
                                    <p className="text-sm max-w-xs mx-auto">
                                       Use the form above to add wallets or tokens to your watchlist.
                                    </p>
                                </div>
                               )
                            )}
                        </div>
                    </div>
                    <div className='lg:col-span-1 lg:mt-[44px]'>
                       <AlertsPanel onNewAlert={() => handleOpenEditor()} />
                    </div>
                </div>
            </div>
        </div>
         <AlertEditorDialog onOpenChange={setIsEditorOpen} entity={editorEntity} />
    </Dialog>
  );
}

