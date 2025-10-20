
'use client';

import Link from 'next/link';
import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users, Eye, Rss, Compass, Settings, LogOut, Wallet, Star, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const navItems = [
    { href: '/feed', label: 'Whale Feed', icon: Rss },
    { href: '/leaderboard', label: 'Explore', icon: Compass },
    { href: '/watchlist', label: 'My Watchlist', icon: Eye },
    { href: '/portfolio', label: 'Portfolio', icon: Wallet },
];

const secondaryNavItems = [
    { href: '/account', label: 'Account Settings', icon: Settings },
]

export function Sidebar({ isCollapsed, onCollapseToggle }: { isCollapsed: boolean, onCollapseToggle: () => void }) {
    const pathname = usePathname();
    const logout = useLogout();
    const { claims } = useUser();
    const isPro = claims?.plan === 'pro';

    return (
        <TooltipProvider delayDuration={0}>
        <div className="flex h-full max-h-screen flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
                 <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
                  <LogoIcon />
                  {!isCollapsed && <span className="font-regular text-lg">
                      Track<span className="font-bold text-primary">100x</span>
                  </span>}
                </Link>
                 {!isCollapsed && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCollapseToggle}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>}
                 {isCollapsed && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCollapseToggle}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>}
            </div>
            <div className={cn("flex-1 overflow-y-auto", isCollapsed && "overflow-y-hidden hover:overflow-y-auto")}>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
                    {navItems.map(item => (
                        isCollapsed ? (
                             <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                            pathname.startsWith(item.href) && "bg-muted text-primary"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="sr-only">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.label}</TooltipContent>
                            </Tooltip>
                        ) : (
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
                        )
                    ))}
                </nav>
            </div>
             <div className={cn("mt-auto border-t p-4 space-y-4", isCollapsed && 'p-2 space-y-2')}>
                {!isPro && !isCollapsed && (
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
                <div className={cn('flex items-center', isCollapsed ? 'flex-col gap-2' : 'gap-4')}>
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </div>
        </TooltipProvider>
    )
}
