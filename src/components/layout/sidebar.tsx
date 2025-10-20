
'use client';

import Link from 'next/link';
import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users, Eye, Rss, Compass, Settings, LogOut, Wallet, Star } from 'lucide-react';
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
import { useUser } from '@/firebase';

const navItems = [
    { href: '/watchlist', label: 'My Watchlist', icon: Eye },
    { href: '/portfolio', label: 'Portfolio', icon: Wallet },
    { href: '/feed', label: 'Whale Feed', icon: Rss },
    { href: '/leaderboard', label: 'Explore', icon: Compass },
];

const secondaryNavItems = [
    { href: '/account', label: 'Account Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname();
    const logout = useLogout();
    const { claims } = useUser();
    const isPro = claims?.plan === 'pro';

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
             <div className="mt-auto border-t p-4 space-y-4">
                {!isPro && (
                     <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                            Unlock all features and get unlimited access.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Button size="sm" className="w-full" asChild>
                                <Link href="/upgrade">
                                 <Star className="h-4 w-4 mr-2"/>
                                 Upgrade
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
                <nav className="grid items-start text-sm font-medium gap-1">
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
            </div>
        </div>
    )
}
