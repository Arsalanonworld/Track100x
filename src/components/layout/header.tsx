
'use client';
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { CommandMenu } from "../command-menu";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24"
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

interface HeaderProps {
  isSidebarExpanded: boolean;
  onToggleSidebar: () => void;
}


export default function Header({ isSidebarExpanded, onToggleSidebar }: HeaderProps) {
    const { user } = useUser();
    
    return (
        <header className={cn(
            "fixed top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px] px-4")}>
                <div className="flex items-center gap-2">
                   <div className="md:hidden">
                    <MobileNav />
                   </div>
                    <div className="hidden md:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={onToggleSidebar}
                      >
                        <ChevronLeft
                          size={16}
                          className={cn("transition-transform", !isSidebarExpanded && "rotate-180")}
                        />
                      </Button>
                      <Link href="/" className="flex items-center space-x-2">
                          <LogoIcon />
                          <span className="font-bold">Track100x</span>
                      </Link>
                    </div>
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
