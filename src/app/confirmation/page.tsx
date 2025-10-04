
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  const router = useRouter();
  const { user, loading, isPro } = useAuth();

  useEffect(() => {
    // Redirect if user is not logged in or is not a pro user
    if (!loading && (!user || !isPro)) {
      router.push('/upgrade');
    }
  }, [user, loading, isPro, router]);

  if (loading || !user || !isPro) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">Upgrade Successful!</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Welcome to WhaleWatch100x Pro! You now have access to all premium features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            A receipt has been sent to your email at <span className="font-semibold">{user.email}</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button asChild size="lg">
                <Link href="/account">Go to My Account</Link>
             </Button>
             <Button asChild variant="outline" size="lg">
                <Link href="/leaderboard">Explore Pro Features <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
