
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-primary"
    >
        <path d="M17.28 9.22a4 4 0 0 0-5.76 5.56" />
        <path d="M16 11.37a4 4 0 0 1-5.5-5.5" />
        <path d="M4 14a1 1 0 0 0-1 1v3.83a1 1 0 0 0 .26.67l1.43 1.43c.2.2.45.3.7.3H18.3a1 1 0 0 0 .7-.3l1.43-1.43a1 1 0 0 0 .26-.67V15a1 1 0 0 0-1-1" />
        <path d="M4.27 14.27C2.43 12.43 2.5 9.5 4.5 7.5s5-2 7 .5" />
        <path d="m10 17 3.5-3.5" />
        <path d="M18.5 21a2.5 2.5 0 0 1-4.82-1.4" />
        <path d="M15 15.5a1.5 1.5 0 0 1-3 0" />
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
