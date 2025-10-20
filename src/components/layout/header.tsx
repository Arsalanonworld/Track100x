
'use client';
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Sidebar } from "./sidebar";
import { CommandMenu } from "../command-menu";

export const LogoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
    >
      <path
        fill="hsl(var(--primary))"
        d="M3.414 4.828a1 1 0 0 1 1.414 0L12 11.586l7.172-6.758a1 1 0 0 1 1.414 1.414L13.414 12l6.172 7.172a1 1 0 1 1-1.414 1.414L12 13.414l-7.172 6.172a1 1 0 0 1-1.414-1.414L10.586 12 4.414 5.828a1 1 0 0 1-1-1.414Z"
      />
      <path
        fill="hsl(var(--border))"
        d="M9.5 12.5 5 8l-2-2 3 3 4.5 4.5zm5 0L19 8l2-2-3 3-4.5 4.5z"
      />
    </svg>
);


export default function Header() {
    const { user, claims } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    const isDashboard = pathname.startsWith('/watchlist') || pathname.startsWith('/feed') || pathname.startsWith('/leaderboard') || pathname.startsWith('/account') || pathname.startsWith('/wallet') || pathname.startsWith('/portfolio');

    useEffect(() => {
        setIsClient(true);
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);


    if (isDashboard) {
        return (
             <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0">
                        <SheetHeader className='hidden'>
                            <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <Sidebar isCollapsed={false} onCollapseToggle={() => {}} />
                    </SheetContent>
                </Sheet>
                <div className="w-full flex-1">
                  <CommandMenu />
                </div>
                <div className="flex items-center gap-2">
                    <UserNav />
                    <ThemeToggle />
                </div>
            </header>
        )
    }

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled ? "border-b bg-background/95 backdrop-blur-sm" : "bg-transparent"
        )}>
            <div className="container flex h-16 items-center">
                <div className="flex flex-1 items-center justify-start">
                    {isClient && <MobileNav />}
                     <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LogoIcon />
                        <span className="font-regular text-lg">
                            Track<span className="font-bold text-primary">100x</span>
                        </span>
                    </Link>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    {isClient && user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
