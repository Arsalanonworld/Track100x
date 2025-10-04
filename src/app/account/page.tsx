'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logout }sever-action';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <PageHeader
        title="My Account"
        description="Manage your profile, subscription, and settings."
      />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">User ID</h3>
            <p className="text-muted-foreground font-mono text-sm">{user.uid}</p>
          </div>
           <div>
            <h3 className="font-semibold">Plan</h3>
            <p className="text-muted-foreground">Free Plan</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Log Out
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
