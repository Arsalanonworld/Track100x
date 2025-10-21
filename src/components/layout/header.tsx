
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-primary"
    >
      <style>
        {`
          @keyframes path-1 {
            0% { stroke-dashoffset: 20; }
            33% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes path-2 {
            0% { stroke-dashoffset: 18; }
            33% { stroke-dashoffset: 18; }
            66% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes path-3 {
            0% { stroke-dashoffset: 29; }
            66% { stroke-dashoffset: 29; }
            100% { stroke-dashoffset: 0; }
          }
          .path-1 { stroke-dasharray: 20; stroke-dashoffset: 20; animation: path-1 2s ease-out infinite; }
          .path-2 { stroke-dasharray: 18; stroke-dashoffset: 18; animation: path-2 2s ease-out infinite; }
          .path-3 { stroke-dasharray: 29; stroke-dashoffset: 29; animation: path-3 2s ease-out infinite; }
        `}
      </style>
      <path className="path-1" d="M14.5 12.5L18 16l-3.5 3.5" />
      <path className="path-2" d="M9.5 12.5L6 16l3.5 3.5" />
      <path className="path-3" d="M12 4v16" />
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
