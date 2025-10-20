
"use client";

import { useState, useEffect } from "react";
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

export default function Sidebar({
  onStateChange,
}: {
  onStateChange: (isExpanded: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, claims } = useUser();
  const logout = useLogout();
  const userPlan = claims?.plan || "free";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem("sidebar-collapsed");
    const collapsed = savedState === 'true';
    setIsCollapsed(collapsed);
    onStateChange(!collapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem("sidebar-collapsed", String(newCollapsedState));
    onStateChange(!newCollapsedState);
  };

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
  ];

  const analyticsItems = [
    {
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      href: "/analytics",
      authRequired: true,
      locked: user ? userPlan === "free" : true, // Locked for guests and free users
    },
  ];

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


  const isExpanded = !isCollapsed;

  if (!isClient) {
      return null;
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card flex flex-col justify-between transition-all duration-300 z-40 border-r",
          isExpanded ? "w-60" : "w-[72px]"
        )}
      >
        <div>
          <div className={cn(
            "flex items-center border-b h-14 lg:h-[60px] px-4",
            isExpanded ? "justify-end" : "justify-center"
          )}>
             <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-card"
              onClick={handleToggle}
            >
              <ChevronLeft
                size={16}
                className={cn("transition-transform", !isExpanded && "rotate-180")}
              />
            </Button>
          </div>
        
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-4">
            <div className="px-3 py-4 space-y-6 flex-1">
              <SidebarSection
                title="CORE"
                items={navItems}
                pathname={pathname}
                isExpanded={isExpanded}
                user={user}
              />

              <SidebarSection
                title="ANALYTICS"
                items={analyticsItems}
                pathname={pathname}
                isExpanded={isExpanded}
                user={user}
              />

              <SidebarSection
                title="ACCOUNT"
                items={accountItems}
                pathname={pathname}
                isExpanded={isExpanded}
                user={user}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-t transition-opacity duration-300 whitespace-nowrap",
            !isExpanded && "opacity-0"
          )}
        >
          {(!user || userPlan === "free") && isExpanded && (
            <div className="p-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-primary-foreground">
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
          "text-[11px] font-bold tracking-wider uppercase text-muted-foreground px-4 transition-opacity duration-300 whitespace-nowrap",
          !isExpanded ? "opacity-0 text-center" : "opacity-100"
        )}
      >
        {!isExpanded ? title[0] : title}
      </h4>
      {items.map((item) => {
        // A feature is locked if it's explicitly marked as locked, or if it requires auth and the user is not logged in.
        const isLocked = item.locked || (item.authRequired && !user);
        const isActive = pathname === item.href;
        const isButton = !!item.onClick;

        // The effective href depends on whether the item is locked.
        const href = isLocked && item.authRequired ? "/login" : item.href;

        const content = (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">{item.icon}</div>
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                !isExpanded && "opacity-0 w-0"
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
            "flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all w-full",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            !isExpanded && "justify-center"
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
