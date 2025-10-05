'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserNav() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/upgrade">Pricing</Link>
      </Button>
    </div>
  );
}
