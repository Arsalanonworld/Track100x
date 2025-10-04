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
import { Bell, PlusCircle, Sparkles, Edit, Trash2, Lock } from 'lucide-react';
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

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();

  // For now, we'll assume any logged in user is 'free'
  // and pro features are locked. This can be expanded later.
  const userPlan = user ? 'free' : 'public';
  const isPro = userPlan === 'pro';

  const activeAlertCount = mockAlerts.length;
  const freeAlertLimit = 3;

  const canCreateAlert = user && activeAlertCount < freeAlertLimit;

  return (
    <>
      <PageHeader
        title="Smart Alerts"
        description="Get notified when wallets perform noteworthy activities."
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Create New Alert
                  </CardTitle>
                  <CardDescription>
                    Simple alerts for specific wallet transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      placeholder="Enter wallet address (e.g., 0x...)"
                      disabled={!user}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-threshold">Transaction Value</Label>
                    <Select disabled={!user}>
                      <SelectTrigger id="alert-threshold">
                        <SelectValue placeholder="Select a threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">Exceeds $10,000</SelectItem>
                        <SelectItem value="50000">Exceeds $50,000</SelectItem>
                        <SelectItem value="100000">Exceeds $100,000</SelectItem>
                        <SelectItem value="1000000" disabled={!isPro}>
                          <div className="flex items-center justify-between">
                            Exceeds $1,000,000
                            {!isPro && <Badge variant="secondary">Pro</Badge>}
                          </div>
                        </SelectItem>
                         <SelectItem value="custom" disabled={!isPro}>
                           <div className="flex items-center justify-between">
                             Custom Amount
                            {!isPro && <Badge variant="secondary">Pro</Badge>}
                           </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                      <Label>Delivery Channel</Label>
                      <p className="text-sm text-muted-foreground">
                        Email alerts are enabled by default. {' '}
                        <a href="/settings" className="text-primary hover:underline">
                          Manage settings
                        </a>.
                      </p>
                    </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={!user || !canCreateAlert}>
                    {user && !canCreateAlert ? 'Alert Limit Reached' : 'Create Alert'}
                  </Button>
                </CardFooter>
                 {!user && (
                    <CardFooter className='flex-col items-start'>
                        <Alert>
                            <AlertTitle>Sign up to create alerts</AlertTitle>
                            <AlertDescription>
                                Create a free account to get started with up to 3 custom alerts.
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                 )}
                 {user && userPlan === 'free' && (
                    <CardFooter className='flex-col items-start'>
                        <Alert className="bg-primary/5 border-primary/20 text-primary-foreground">
                             <Sparkles className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">Upgrade to Pro</AlertTitle>
                            <AlertDescription>
                                You have {freeAlertLimit - activeAlertCount} of {freeAlertLimit} free alerts remaining. {' '}
                                <a href="#" className="font-semibold hover:underline">Upgrade to Pro</a> for unlimited alerts.
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                 )}
              </Card>
            </TabsContent>
            <TabsContent value="advanced">
                 <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Lock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-2xl font-bold font-headline mb-2">Unlock Advanced Alerts</h3>
                        <p className="text-muted-foreground mb-4 max-w-xs text-center">
                            Create multi-condition rules and use custom thresholds.
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
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold font-headline mb-4">
            Manage Alerts ({activeAlertCount})
          </h2>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <Card key={alert.id} className="flex items-center p-4">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-grow ml-4">
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                   <Switch
                    id={`alert-switch-${alert.id}`}
                    checked={alert.enabled}
                    aria-label={`Enable or disable ${alert.title}`}
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
             {activeAlertCount === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center h-full">
                    <Bell className="h-10 w-10 text-muted-foreground mb-4"/>
                    <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
                    <p className="text-muted-foreground">
                    Create your first alert to start monitoring wallet activity.
                    </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
