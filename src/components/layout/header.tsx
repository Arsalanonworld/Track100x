
'use client';
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CommandMenu } from "../command-menu";

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}


export default function Header() {
    const { user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    
    const pathname = usePathname();
    
    const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);
    
    useEffect(() => {
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


    return (
        <header className={cn(
            "sticky top-0 z-40 w-full transition-all duration-300 border-b",
            scrolled ? "bg-background/95 backdrop-blur-sm" : "bg-background"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px] px-4")}>
                
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                       <MobileNav items={[]} />
                    </div>

                    <Link href="/" className="hidden md:flex items-center gap-2 font-semibold mr-4">
                        <LogoIcon />
                        <span className={cn("text-lg whitespace-nowrap")}>Track100x</span>
                    </Link>
                     
                     {isAppPage && (
                        <div className="w-full max-w-sm lg:max-w-md">
                            <CommandMenu />
                        </div>
                     )}
                </div>
                
                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
