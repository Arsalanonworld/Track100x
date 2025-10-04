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
import { Bell, PlusCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function AlertsPage() {
  return (
    <>
      <PageHeader
        title="Smart Alerts"
        description="Get notified when wallets perform noteworthy activities."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Alert
              </CardTitle>
              <CardDescription>
                Define a custom alert to track specific on-chain events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-title">Alert Title</Label>
                <Input
                  id="alert-title"
                  placeholder="e.g., Large Stablecoin Inflow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-condition">Condition</Label>
                <Input
                  id="alert-condition"
                  placeholder="e.g., Wallet address = '0x...' AND amount > 1M"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Alert</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-4">
            Existing Alerts
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
                <div className="ml-4">
                  <Switch
                    id={`alert-switch-${alert.id}`}
                    checked={alert.enabled}
                    aria-label={`Enable or disable ${alert.title}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
