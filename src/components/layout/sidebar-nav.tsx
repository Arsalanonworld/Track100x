
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Trophy,
  Bell,
  Sparkles,
  Newspaper,
  User,
  Settings,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/insights', label: 'Insights', icon: Sparkles },
];

const secondaryNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/account', label: 'Account', icon: User },
]

const WhaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
      <path d="M16.963 10.037c.781-1.25.625-2.852-.39-3.867l-1.07-1.07c-1.562-1.562-4.095-1.562-5.657 0L8.778 6.17c-1.562 1.562-1.562 4.095 0 5.657l1.07 1.07c1.015 1.015 2.617 1.172 3.867.39l.781 1.25a.75.75 0 001.272-.79l-.782-1.251.002-.002zm-1.13 2.139a.75.75 0 01-1.06 0l-1.07-1.07a2.501 2.501 0 010-3.536l1.068-1.068a2.5 2.5 0 013.536 0l1.07 1.07c.976.976.976 2.56 0 3.535l-1.07 1.07a.75.T5 0 01-1.06 0l-.53-.53-.53.53zM12 18a.75.75 0 01-.75-.75V15a.75.75 0 011.5 0v2.25A.75.75 0 0112 18zM9.062 14.938a. ৭৫.75 0 01-1.06-1.06l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5zM14.938 14.938a.75.75 0 11-1.06-1.06l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5z" />
    </svg>
  );

export default function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, isUserLoading } = useUser();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <WhaleIcon />
          <h1
            className={`font-bold text-xl font-headline transition-opacity duration-200 ${
              state === 'collapsed' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            WhaleWatch
          </h1>
          <div className="flex-1" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <div>
            <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    asChild
                >
                    <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span
                        className={`transition-opacity duration-200 ${
                        state === 'collapsed' ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {item.label}
                    </span>
                    </Link>
                </Button>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </div>
        <div>
            <div className={`p-2 transition-opacity duration-200 ${ state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
                <Button className="w-full bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary/20" asChild>
                    <Link href="/upgrade">
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </Link>
                </Button>
            </div>

            <SidebarMenu>
            {user && secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    asChild
                >
                    <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span
                        className={`transition-opacity duration-200 ${
                        state === 'collapsed' ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {item.label}
                    </span>
                    </Link>
                </Button>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </div>
      </SidebarContent>
    </>
  );
}
