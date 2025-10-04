
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                        <PartyPopper className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold font-headline">Upgrade Successful!</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Welcome to WhaleWatch100x Pro. You now have access to all premium features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-background p-4 text-left text-sm">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> Unlimited Real-Time Alerts</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> Full Leaderboard Access</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> AI-Powered Insights</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> Advanced Alert Builder</li>
                        </ul>
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/alerts">Start Creating Alerts</Link>
                    </Button>
                     <Button asChild variant="outline" className="w-full">
                        <Link href="/account">Go to My Account</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
