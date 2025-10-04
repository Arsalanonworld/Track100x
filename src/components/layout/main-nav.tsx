
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Zap, Bell, BarChart, FileText, Star } from "lucide-react"
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"
import { AnimatedButton } from "../ui/animated-button"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart, guest: true },
    { href: '/watchlist', label: 'Watchlist', icon: Star, guest: false },
    { href: '/alerts', label: 'Alerts', icon: Bell, guest: false },
    { href: '/insights', label: 'Insights', icon: FileText, guest: true },
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
    const isPro = userData?.plan === 'pro';

    const visibleNavItems = navItems.filter(item => user || item.guest);

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {visibleNavItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-2 transition-colors hover:text-foreground",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
        ))}
        {user && !isPro && (
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
