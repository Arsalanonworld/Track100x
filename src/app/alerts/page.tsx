
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAlerts } from '@/lib/mock-data';
import { Bell, Plus, Sparkles, Edit, Trash2, Lock, Wallet, Tag, History, CheckCircle, PauseCircle, PlayCircle, MoreVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const QuickAlertConfigurator = ({ isPro }: { isPro: boolean }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>('wallet');

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <Label>Alert Type</Label>
            <Select onValueChange={(v: 'wallet' | 'token') => setAlertType(v)} defaultValue="wallet">
                <SelectTrigger>
                    <SelectValue placeholder="Select alert type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="wallet">
                        <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Wallet Activity</div>
                    </SelectItem>
                    <SelectItem value="token">
                        <div className="flex items-center gap-2"><Tag className="h-4 w-4" /> Token Events</div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        {alertType === 'wallet' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address or ENS</Label>
              <Input
                id="wallet-address"
                placeholder="e.g., 0x... or vitalik.eth"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-rule">Rule</Label>
               <Select>
                <SelectTrigger id="wallet-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx-value">Transaction Value</SelectItem>
                  <SelectItem value="balance-change" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Token Balance Change</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                   <SelectItem value="pnl-change" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>7d PnL Change</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                   <SelectItem value="dormancy" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Dormancy Status</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-threshold">Threshold</Label>
               <Select>
                <SelectTrigger id="wallet-threshold">
                  <SelectValue placeholder="Select a threshold..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">Exceeds $10,000</SelectItem>
                  <SelectItem value="50000">Exceeds $50,000</SelectItem>
                  <SelectItem value="100000">Exceeds $100,000</SelectItem>
                  <SelectItem value="1000000" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Exceeds $1,000,000</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {alertType === 'token' && (
            <>
            <div className="space-y-2">
              <Label htmlFor="token-symbol">Token Symbol</Label>
              <Input
                id="token-symbol"
                placeholder="e.g., WIF, PEPE"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="token-rule">Rule</Label>
               <Select>
                <SelectTrigger id="token-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-change">Price Change %</SelectItem>
                  <SelectItem value="new-whale-tx">New Whale Transaction</SelectItem>
                  <SelectItem value="liquidity-shift" disabled={!isPro}>
                     <div className="flex items-center justify-between w-full"><span>Liquidity Shift %</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            </>
        )}
        
         <div className="space-y-2">
            <Label>Delivery Channel</Label>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm font-medium">Email</p>
                    <Switch defaultChecked disabled/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${!isPro ? 'bg-muted/50 opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Telegram</p>
                        {!isPro && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={!isPro}/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${!isPro ? 'bg-muted/50 opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-medium">Discord</p>
                       {!isPro && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={!isPro}/>
                </div>
             </div>
             {!isPro && (
                <p className="text-sm text-muted-foreground">
                    <a href="/upgrade" className="text-primary hover:underline font-semibold">
                    Upgrade to Pro
                    </a>
                    {' '} for Telegram & Discord notifications.
                </p>
             )}
          </div>
          <Button className="w-full">
          Create Alert
        </Button>
    </div>
  );
};

const CreateAlertModal = ({ isPro, canCreateAlert }: { isPro: boolean, canCreateAlert: boolean }) => (
    <DialogContent className="max-w-lg">
        <DialogHeader>
            <DialogTitle>Create a New Alert</DialogTitle>
            <DialogDescription>
                Set up a notification for on-chain events.
            </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quick">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Quick Alert</TabsTrigger>
                <TabsTrigger value="advanced" disabled={!isPro}>
                    <div className="flex items-center gap-2">
                        {!isPro && <Lock className="h-4 w-4" />}
                        Advanced Builder
                    </div>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="quick" className="pt-4">
                {!canCreateAlert ? (
                     <Alert className="bg-primary/5 border-primary/20 text-primary-foreground text-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Free Alert Limit Reached</AlertTitle>
                        <AlertDescription>
                            You have used all your available alerts. {' '}
                            <a href="/upgrade" className="font-semibold hover:underline">Upgrade to Pro</a> for unlimited alerts.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <QuickAlertConfigurator isPro={isPro} />
                )}
            </TabsContent>
            <TabsContent value="advanced" className="pt-4">
                <Card className="relative overflow-hidden border-dashed border-2">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-8 text-center">
                        <Lock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold font-headline mb-2">Unlock the Advanced Builder</h3>
                        <p className="text-muted-foreground mb-4">
                            Build powerful, multi-condition rules and unlock more delivery channels.
                        </p>
                        <Button asChild>
                            <a href="/upgrade">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </a>
                        </Button>
                    </div>
                    <CardHeader>
                      <CardTitle>Advanced Builder</CardTitle>
                       <CardDescription>
                        Build complex, multi-condition alert rules.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Conditions</Label>
                        <div className="p-4 border rounded-md bg-muted/50 text-muted-foreground h-24">
                            (IF Transaction Value {'>'} $1,000,000) AND (Counterparty is "Binance")
                        </div>
                      </div>
                    </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
    </DialogContent>
);


export default function AlertsPage() {
  const { user, isUserLoading } = useUser();

  // For now, we'll assume any logged in user is 'free'
  // and pro features are locked. This can be expanded later.
  const userPlan = user ? 'free' : 'public';
  const isPro = userPlan === 'pro';

  const activeAlertCount = mockAlerts.length;
  const freeAlertLimit = 3;

  const canCreateAlert = user && (isPro || activeAlertCount < freeAlertLimit);

  const recentAlerts = [
      { id: '1', name: 'PEPE Whale Tx', description: 'Whale 0x123... swapped $1.25M PEPE to ETH on Uniswap', time: '5 min ago', delivery: 'Email'},
      { id: '2', name: 'Vitalik Wallet Monitor', description: '0xabc... received 5,000 ETH from Wintermute', time: '2 hours ago', delivery: 'Push'},
      { id: '3', name: 'WIF Price Alert', description: 'WIF Price increased by 12.5% to $2.80', time: 'yesterday', delivery: 'Email'},
  ];

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader
        title="Your Alerts"
        description="Track whales, wallets, and tokens in real-time. Never miss a big move."
      />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Alert
                </Button>
            </DialogTrigger>
            {user ? (
                <CreateAlertModal isPro={isPro} canCreateAlert={canCreateAlert} />
            ) : (
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign Up to Create Alerts</DialogTitle>
                        <DialogDescription>
                            Create a free account to get started with up to 3 custom alerts.
                        </DialogDescription>
                    </DialogHeader>
                    <Alert>
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            Please log in or create an account to manage your alerts.
                        </AlertDescription>
                    </Alert>
                    <Button className="w-full" asChild><a href="/auth/login">Login / Sign Up</a></Button>
                 </DialogContent>
            )}
        </Dialog>

        {!isPro && user && (
             <Button variant="secondary" asChild>
                <a href="/upgrade">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Upgrade to Unlock Advanced Alerts
                </a>
            </Button>
        )}
      </div>

        <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">
                Active Alerts ({user ? activeAlertCount : 0})
              </h2>
               {userPlan === 'free' && (
                    <Alert className="mb-4 bg-primary/5 border-primary/20 text-primary-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Upgrade to Pro</AlertTitle>
                        <AlertDescription>
                            You have {Math.max(0, freeAlertLimit - activeAlertCount)} of {freeAlertLimit} free alerts remaining. {' '}
                            <a href="/upgrade" className="font-semibold hover:underline">Upgrade</a> for unlimited alerts & advanced rules.
                        </AlertDescription>
                    </Alert>
                 )}
              <Accordion type="single" collapsible className="space-y-4">
                {user && mockAlerts.map((alert) => (
                    <AccordionItem value={alert.id} key={alert.id} className="border-b-0">
                         <Card className="overflow-hidden">
                            <div className="flex items-center p-4">
                                <div className="flex-shrink-0">
                                {alert.type === 'wallet' ? <Wallet className="h-6 w-6 text-accent-foreground"/> : <Tag className="h-6 w-6 text-accent-foreground"/>}
                                </div>
                                <div className="flex-grow mx-4">
                                    <p className="font-semibold">{alert.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {alert.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                <Badge variant={alert.enabled ? 'default' : 'secondary'}>{alert.enabled ? 'Active' : 'Paused'}</Badge>
                                    <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:rotate-90">
                                        <MoreVertical className="h-4 w-4"/>
                                    </AccordionTrigger>
                                </div>
                            </div>
                            <AccordionContent>
                                <div className="bg-muted/50 px-4 py-3 border-t">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="text-muted-foreground">
                                            <p>Last triggered: <span className="text-foreground">3 hours ago</span></p>
                                            <p>Created on: <span className="text-foreground">June 1, 2024</span></p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                {alert.enabled ? <PauseCircle className="mr-2" /> : <PlayCircle className="mr-2" />}
                                                {alert.enabled ? 'Pause' : 'Resume'}
                                            </Button>
                                             <Button variant="ghost" size="sm">
                                                <Edit className="mr-2"/>
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                <Trash2 className="mr-2"/>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </Card>
                  </AccordionItem>
                ))}
                 {(!user || activeAlertCount === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-full">
                        <Bell className="h-10 w-10 text-muted-foreground mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">{user ? 'No Active Alerts' : 'Login to See Alerts'}</h3>
                        <p className="text-muted-foreground">
                        {user ? 'Create your first alert to start monitoring on-chain activity.' : 'Sign up for a free account to create alerts.'}
                        </p>
                  </div>
                )}
              </Accordion>
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    <History className="h-6 w-6" />
                    Alert History
                </h2>
                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            {user && recentAlerts.map(item => (
                                <li key={item.id} className="p-4 flex items-start gap-4">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1"/>
                                    <div className="flex-grow">
                                        <p><span className="font-semibold">{item.name}</span> <span className="text-muted-foreground">triggered:</span> {item.description}</p>
                                        <p className="text-xs text-muted-foreground">{item.delivery} &bull; {item.time}</p>
                                    </div>
                                </li>
                            ))}
                             {!user && (
                                <li className="p-8 text-center text-muted-foreground">
                                    Your triggered alert history will appear here.
                                </li>
                            )}
                             {user && recentAlerts.length === 0 && (
                                 <li className="p-8 text-center text-muted-foreground">
                                    No alerts have been triggered recently.
                                 </li>
                             )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  );
}
