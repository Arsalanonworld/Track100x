
'use client';
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";

export const LogoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-primary"
    >
      <path d="M12 10.5c-1.5 0-2.5-1-2.5-2.5S10.5 5.5 12 5.5s2.5 1 2.5 2.5-1 2.5-2.5 2.5z" />
      <path d="M12 2a10 10 0 0 0-7.53 16.58l5.85 3.32a2 2 0 0 0 2.05 0l5.85-3.32A10 10 0 0 0 12 2zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);


export default function Header() {
    const { user, claims } = useUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <MobileNav />
                     <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LogoIcon />
                        <span className="hidden font-bold sm:inline-block">Track100x</span>
                    </Link>
                    <MainNav />
                </div>

                <div className="flex items-center space-x-2">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
