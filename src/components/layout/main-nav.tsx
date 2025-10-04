
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"
import { AnimatedButton } from "../ui/animated-button"
import { Zap } from "lucide-react"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard', guest: true },
    { href: '/watchlist', label: 'Watchlist', guest: false },
    { href: '/alerts', label: 'Alerts', guest: false },
    { href: '/insights', label: 'Insights', guest: true },
];

export function MainNav() {
    const pathname = usePathname()
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    
    const { data: userData } = useDoc(userDocRef);
    
    const isFree = user && userData?.plan === 'free';

    const visibleNavItems = navItems.filter(item => {
        if (!user) return item.guest; // Guests see items marked for them
        return true; // Logged-in users see all items
    });

  return (
    <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
        <div className="flex items-center space-x-6">
            {visibleNavItems.map((item) => (
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
         {isFree && (
             <AnimatedButton asChild size="sm">
                <Link
                    href="/upgrade"
                    className={cn(
                        "flex items-center gap-2"
                    )}
                >
                    <Zap className="h-4 w-4" />
                    Upgrade
                </Link>
             </AnimatedButton>
        )}
    </nav>
  )
}
