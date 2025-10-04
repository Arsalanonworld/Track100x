'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAlerts } from '@/lib/mock-data';
import { Bell, PlusCircle, Sparkles, Edit, Trash2, Lock, Wallet, Tag, History, CheckCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const QuickAlertConfigurator = ({ isPro, canCreateAlert }: { isPro: boolean, canCreateAlert: boolean }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>('wallet');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Create Quick Alert
        </CardTitle>
        <CardDescription>
          Simple, one-click alerts for common on-chain events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="Enter wallet address (e.g., 0x...)"
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
                    <div className="flex items-center justify-between">Token Balance Change {!isPro && <Badge variant="secondary">Pro</Badge>}</div>
                  </SelectItem>
                   <SelectItem value="pnl-change" disabled={!isPro}>
                    <div className="flex items-center justify-between">PnL Change (7d) {!isPro && <Badge variant="secondary">Pro</Badge>}</div>
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
                    <div className="flex items-center justify-between">Exceeds $1,000,000 {!isPro && <Badge variant="secondary">Pro</Badge>}</div>
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
                     <div className="flex items-center justify-between">Liquidity Shift % {!isPro && <Badge variant="secondary">Pro</Badge>}</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            </>
        )}
        
         <div className="space-y-2">
            <Label>Delivery Channel</Label>
            <div className="flex items-center justify-between rounded-md border p-3">
                <p className="text-sm font-medium">Email</p>
                <Switch defaultChecked disabled/>
            </div>
             <p className="text-sm text-muted-foreground">
                Email alerts are enabled by default. Pro users can unlock {' '}
                <a href="/upgrade" className="text-primary hover:underline">
                  more channels
                </a>.
              </p>
          </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!canCreateAlert}>
          { !canCreateAlert ? 'Alert Limit Reached' : 'Create Alert'}
        </Button>
      </CardFooter>
    </Card>
  )
}

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
      { id: '1', entity: 'PEPE Whale', rule: 'Sent > $1M to CEX', value: '$1,250,000 to Binance', time: '5 min ago'},
      { id: '2', entity: '0x123...abc', rule: 'Portfolio Value > 5%', value: '+7.2% ($85,000)', time: '2 hours ago'},
      { id: '3', entity: 'WIF Token', rule: 'Price Change > 10%', value: '+12.5% ($2.80)', time: 'yesterday'},
  ];

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader
        title="Smart Alerts"
        description="Central hub for creating, managing, and tracking custom notifications."
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="quick">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Alert</TabsTrigger>
              <TabsTrigger value="advanced" disabled={!isPro}>
                <div className="flex items-center gap-2">
                  {!isPro && <Lock className="h-4 w-4" />}
                  Advanced Builder
                  {!isPro && <Badge variant="destructive" className="ml-2 hidden sm:block">Pro</Badge>}
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quick">
               {!user ? (
                 <Card>
                    <CardHeader>
                        <CardTitle>Sign Up to Create Alerts</CardTitle>
                        <CardDescription>
                            Create a free account to get started with up to 3 custom alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertTitle>Login Required</AlertTitle>
                            <AlertDescription>
                                Please log in or create an account to manage your alerts.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                     <CardFooter>
                        <Button className="w-full" asChild><a href="/auth/login">Login / Sign Up</a></Button>
                    </CardFooter>
                 </Card>
               ) : (
                <>
                <QuickAlertConfigurator isPro={isPro} canCreateAlert={canCreateAlert} />
                {userPlan === 'free' && (
                    <Alert className="mt-4 bg-primary/5 border-primary/20 text-primary-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Upgrade to Pro</AlertTitle>
                        <AlertDescription>
                            You have {Math.max(0, freeAlertLimit - activeAlertCount)} of {freeAlertLimit} free alerts remaining. {' '}
                            <a href="/upgrade" className="font-semibold hover:underline">Upgrade</a> for unlimited alerts & advanced rules.
                        </AlertDescription>
                    </Alert>
                 )}
                </>
               )}

            </TabsContent>
            <TabsContent value="advanced">
                 <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Lock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-2xl font-bold font-headline mb-2">Unlock Advanced Alerts</h3>
                        <p className="text-muted-foreground mb-4 max-w-xs text-center">
                            Build powerful, multi-condition rules and unlock more delivery channels.
                        </p>
                        <Button>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Upgrade to Pro
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
                        <div className="p-4 border rounded-md bg-muted/50 text-muted-foreground">
                            Rule builder UI...
                        </div>
                      </div>
                       <div className="space-y-2">
                        <Label>Delivery</Label>
                        <div className="p-4 border rounded-md bg-muted/50 text-muted-foreground">
                            Webhook, Discord, Telegram options...
                        </div>
                      </div>
                    </CardContent>
                     <CardFooter>
                      <Button className="w-full" disabled>Create Advanced Alert</Button>
                    </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
        <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">
                Manage Alerts ({user ? activeAlertCount : 0})
              </h2>
              <div className="space-y-4">
                {user && mockAlerts.map((alert) => (
                  <Card key={alert.id} className="flex items-center p-4">
                    <div className="flex-shrink-0">
                      {alert.type === 'wallet' ? <Wallet className="h-6 w-6 text-accent"/> : <Tag className="h-6 w-6 text-accent"/>}
                    </div>
                    <div className="flex-grow ml-4">
                      <p className="font-semibold">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                       <Badge variant={alert.enabled ? 'default' : 'secondary'}>{alert.enabled ? 'Active' : 'Inactive'}</Badge>
                       <Switch
                        id={`alert-switch-${alert.id}`}
                        checked={alert.enabled}
                        aria-label={`Toggle ${alert.title}`}
                      />
                      <Button variant="ghost" size="icon" aria-label="Edit Alert">
                          <Edit className="h-4 w-4"/>
                      </Button>
                       <Button variant="ghost" size="icon" aria-label="Delete Alert">
                          <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                    </div>
                  </Card>
                ))}
                 {(!user || activeAlertCount === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center h-full">
                        <Bell className="h-10 w-10 text-muted-foreground mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">{user ? 'No Active Alerts' : 'Login to See Alerts'}</h3>
                        <p className="text-muted-foreground">
                        {user ? 'Create your first alert to start monitoring wallet activity.' : 'Sign up for a free account to create alerts.'}
                        </p>
                  </div>
                )}
              </div>
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    <History className="h-6 w-6" />
                    Recent Alerts Summary
                </h2>
                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            {user && recentAlerts.map(item => (
                                <li key={item.id} className="p-4 flex items-center gap-4">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.entity} <span className="text-muted-foreground font-normal">triggered</span> {item.rule}</p>
                                        <p className="text-sm text-muted-foreground">{item.value}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex-shrink-0">{item.time}</p>
                                </li>
                            ))}
                             {!user && (
                                <li className="p-8 text-center text-muted-foreground">
                                    Your triggered alert history will appear here.
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
