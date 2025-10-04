
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"
import { AnimatedButton } from "../ui/animated-button"
import { Zap } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard', guest: true },
    { href: '/watchlist', label: 'Watchlist', guest: false },
    { href: '/alerts', label: 'Alerts', guest: false },
    { href: '/insights', label: 'Insights', guest: true },
];

export function MainNav() {
    const pathname = usePathname()
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    
    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    
    const isLoading = isUserLoading || isUserDataLoading;
    const isFree = user && userData?.plan === 'free';

    const visibleNavItems = navItems.filter(item => {
        if (isLoading) return item.guest;
        if (!user) return item.guest;
        return true;
    });

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <div className="flex items-center space-x-4">
            {isLoading && (
                <>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </>
            )}
            {!isLoading && visibleNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </div>
         {isFree && !isLoading && (
            <AnimatedButton asChild size="sm">
                <Link
                    href="/upgrade"
                    className="flex items-center gap-2"
                >
                    <Zap className="h-4 w-4" />
                    Upgrade
                </Link>
            </AnimatedButton>
        )}
    </nav>
  )
}
