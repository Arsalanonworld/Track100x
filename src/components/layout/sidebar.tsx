
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BarChart3,
  LogOut,
  Star,
  Lock,
  Compass,
  Eye,
  Wallet,
  Rss,
  Settings,
  ChevronLeft,
  LogIn,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { useLogout } from "../auth/auth-actions";
import { Button } from "../ui/button";

const navItems = [
    {
      label: "Whale Feed",
      icon: <Rss size={18} />,
      href: "/feed",
      authRequired: false,
    },
    {
      label: "Explore",
      icon: <Compass size={18} />,
      href: "/leaderboard",
      authRequired: false,
    },
    {
      label: "Watchlist",
      icon: <Eye size={18} />,
      href: "/watchlist",
      authRequired: true,
    },
    {
      label: "Alerts",
      icon: <Bell size={18} />,
      href: "/alerts",
      authRequired: true,
    },
    {
      label: "Portfolio",
      icon: <Wallet size={18} />,
      href: "/portfolio",
      authRequired: true,
    },
    {
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      href: "/analytics",
      authRequired: true,
      locked: true,
    },
  ];

export default function Sidebar({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { user, claims } = useUser();
  const logout = useLogout();
  const userPlan = claims?.plan || "free";

  const accountItems = user 
    ? [
        {
          label: "My Account",
          icon: <Settings size={18} />,
          href: "/account",
          authRequired: true,
        },
        {
          label: "Log Out",
          icon: <LogOut size={18} />,
          href: "#",
          onClick: logout,
          authRequired: true,
        },
      ]
    : [
        {
          label: "Log In",
          icon: <LogIn size={18} />,
          href: "/login",
          authRequired: false,
        },
      ];

  const finalNavItems = navItems.map(item => {
    if (item.href === '/analytics') {
      return { ...item, locked: user ? userPlan === 'free' : true };
    }
    return item;
  });


  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 z-40 border-r bg-background fixed top-0 left-0 h-screen pt-14 lg:pt-[60px]",
          isExpanded ? "w-60" : "w-[72px]"
        )}
      >
        <div className="flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
            <div className="px-3 py-4 space-y-6">
              <SidebarSection
                title="CORE"
                items={finalNavItems}
                pathname={pathname}
                isExpanded={isExpanded}
                user={user}
              />
            </div>
            <div className="px-3 py-4 space-y-6 mt-auto">
              <SidebarSection
                  title="ACCOUNT"
                  items={accountItems}
                  pathname={pathname}
                  isExpanded={isExpanded}
                  user={user}
                />
            </div>
        </div>
          
        {isExpanded && (!user || userPlan === "free") && (
          <div className="p-3 border-t">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-primary-foreground animate-pulse-slow">
                <p className="font-bold text-sm mb-1">Unlock Full Power</p>
                <p className="text-xs opacity-90 mb-3">
                  Get advanced analytics, unlimited alerts & more.
                </p>
                <Link
                  href="/upgrade"
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Star size={14} />
                  Upgrade to Pro
                </Link>
              </div>
          </div>
        )}
         <div
          className={cn(
            "absolute top-1/2 -right-[14px] -translate-y-1/2 z-50",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-7 w-7 rounded-full p-0 flex items-center justify-center bg-background hover:bg-muted border-primary/50 text-primary hover:text-primary shadow-lg"
                onClick={onToggle}
              >
                <ChevronLeft
                  size={16}
                  className={cn(
                    "transition-transform",
                    isExpanded ? "rotate-0" : "rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function SidebarSection({
  title,
  items,
  pathname,
  isExpanded,
  user,
}: {
  title: string;
  items: any[];
  pathname: string;
  isExpanded: boolean;
  user: any;
}) {
  return (
    <div className="space-y-1">
      <h4
        className={cn(
          "text-[11px] font-bold tracking-wider uppercase text-muted-foreground transition-opacity duration-300 whitespace-nowrap",
          isExpanded ? "opacity-100 px-4" : "opacity-0 text-center h-0"
        )}
      >
        {isExpanded ? title : ''}
      </h4>
      {items.map((item) => {
        const isLocked = item.locked || (item.authRequired && !user);
        const isActive = pathname === item.href;
        const isButton = !!item.onClick;
        const href = isLocked && item.authRequired ? "/login" : item.href;

        const content = (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">{item.icon}</div>
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-200",
                isExpanded ? "opacity-100" : "opacity-0 w-0"
              )}
            >
              {item.label}
            </span>
             {item.locked && isExpanded && (
              <Lock
                size={12}
                className="ml-auto text-yellow-500 shrink-0"
              />
            )}
          </div>
        );
        
        const sharedClasses = cn(
            "flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all w-full",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            isExpanded ? "px-4" : "justify-center"
          );

        return (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <span>
                {isButton ? (
                  <button onClick={item.onClick} className={sharedClasses}>
                    {content}
                  </button>
                ) : (
                  <Link
                    href={href}
                    className={sharedClasses}
                  >
                    {content}
                  </Link>
                )}
              </span>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right">
                {item.label} {item.locked && "(Pro)"}
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
}
