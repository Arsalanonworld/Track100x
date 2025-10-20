
'use client';

import Link from 'next/link';
import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users, Eye, Rss, Compass, Settings, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogoIcon } from './header';
import { UserNav } from '../user-nav';
import { ThemeToggle } from '../theme-toggle';
import { Separator } from '../ui/separator';
import { useLogout } from '../auth/auth-actions';

const navItems = [
    { href: '/watchlist', label: 'My Watchlist', icon: Eye },
    { href: '/feed', label: 'Whale Feed', icon: Rss },
    { href: '/leaderboard', label: 'Explore', icon: Compass },
];

const secondaryNavItems = [
    { href: '/account', label: 'Account Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname();
    const logout = useLogout();

    return (
        <div className="flex h-full max-h-screen flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                  <LogoIcon />
                  <span className="font-regular text-lg">
                      Track<span className="font-bold text-primary">100x</span>
                  </span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname.startsWith(item.href) && "bg-muted text-primary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
             <div className="mt-auto border-t">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
                    {secondaryNavItems.map(item => (
                         <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname.startsWith(item.href) && "bg-muted text-primary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </nav>
                <Separator />
                <div className='flex items-center justify-between p-4'>
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}
