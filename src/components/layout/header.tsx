
'use client';
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { CommandMenu } from "../command-menu";
import React, { useState, useEffect } from "react";

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-primary"
    >
      <path d="M12 11.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path
        fillRule="evenodd"
        d="M2.25 3.385c0-.83.824-1.408 1.61-.99L11.25 7.5v.033l-9.615-5.138A1.125 1.125 0 012.25 3.385zm19.5 0a1.125 1.125 0 00-2.228.415L12.75 7.533V7.5L20.14 2.395c.787-.418 1.61.16 1.61.99zM12 8.283l-9.75 5.186V15.75l9.75-5.186v-2.28zm0-2.28L21.75 11.25V9.75L12 4.564v1.436zM3.86 16.245l7.39 3.92V21l-8.25-4.385A1.125 1.125 0 013.86 15zM12.75 21v-1.165l7.39-3.92a1.125 1.125 0 011.855 1.165L12.75 21z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
    const { user } = useUser();
    
    return (
        <header className={cn(
            "fixed top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px] px-4")}>
                <div className="flex items-center gap-2 md:hidden">
                   <MobileNav />
                   <Link href="/" className="flex items-center space-x-2 pl-2">
                        <LogoIcon />
                        <span className="font-bold">Track100x</span>
                    </Link>
                </div>
                
                <div className="flex-1 flex justify-center px-4">
                    <div className="w-full max-w-md">
                      <CommandMenu />
                    </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
