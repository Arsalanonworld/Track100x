
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
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { useLogout } from "../auth/auth-actions";
import { Button } from "../ui/button";

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

export default function Sidebar({ onStateChange }: { onStateChange: (isExpanded: boolean) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { user, claims } = useUser();
  const logout = useLogout();
  const userPlan = claims?.plan || 'free';
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      const collapsed = savedState === 'true';
      setIsCollapsed(collapsed);
      onStateChange(!collapsed);
    } else {
      onStateChange(true);
    }
  }, []);

  useEffect(() => {
    onStateChange(isHovered || !isCollapsed);
  }, [isHovered, isCollapsed, onStateChange]);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebar-collapsed', String(newCollapsedState));
    onStateChange(isHovered || !newCollapsedState);
  };

  const navItems = [
    {
      label: "Whale Feed",
      icon: <Rss size={18} />,
      href: "/feed",
      visibleFor: ["free", "pro"],
      authRequired: false,
    },
    {
      label: "Explore",
      icon: <Compass size={18} />,
      href: "/leaderboard",
      visibleFor: ["free", "pro"],
      authRequired: false,
    },
    {
      label: "Watchlist",
      icon: <Eye size={18} />,
      href: "/watchlist",
      visibleFor: ["free", "pro"],
      authRequired: true,
    },
    {
      label: "Alerts",
      icon: <Bell size={18} />,
      href: "/alerts",
      visibleFor: ["free", "pro"],
      authRequired: true,
    },
    {
      label: "Portfolio",
      icon: <Wallet size={18} />,
      href: "/portfolio",
      visibleFor: ["free", "pro"],
      authRequired: true,
    },
  ];

  const analyticsItems = [
    {
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      href: "/analytics",
      visibleFor: ["pro"],
      locked: user ? userPlan === "free" : true,
      authRequired: true,
    },
  ];

  const accountItems = [
    {
      label: "My Account",
      icon: <Settings size={18} />,
      href: "/account",
      visibleFor: ["free", "pro"],
      authRequired: true,
    },
  ];
  
  if (user) {
    accountItems.push({
        label: "Log Out",
        icon: <LogOut size={18} />,
        href: "#",
        onClick: logout,
        visibleFor: ["free", "pro"],
        authRequired: true,
      });
  }

  const isExpanded = isHovered || !isCollapsed;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "h-screen border-r border-border bg-card flex flex-col justify-between transition-all duration-300",
          isExpanded ? "w-60" : "w-[72px]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col flex-1">
          {/* Header / Logo */}
          <div className={cn("flex items-center justify-between border-b border-border h-14 lg:h-[60px]", isExpanded ? 'pl-4 pr-2' : 'px-2 justify-center')}>
            <Link href="/" className={cn("flex items-center gap-2 font-semibold")}>
                <LogoIcon />
                {isExpanded && <span className="text-lg">Track100x</span>}
            </Link>
            {isExpanded && (
                <Button
                    variant="ghost"
                    className="p-2 h-auto"
                    onClick={handleToggle}
                    >
                    <ChevronLeft size={18} />
                </Button>
            )}
          </div>

          {/* NAVIGATION */}
          <div className="px-3 py-4 space-y-6 flex-1">
            <SidebarSection
              title="CORE"
              items={navItems}
              pathname={pathname}
              isCollapsed={!isExpanded}
              user={user}
            />

            <SidebarSection
              title="ANALYTICS"
              items={analyticsItems}
              pathname={pathname}
              isCollapsed={!isExpanded}
              user={user}
            />
            
            {user && (
                 <SidebarSection
                    title="ACCOUNT"
                    items={accountItems}
                    pathname={pathname}
                    isCollapsed={!isExpanded}
                    user={user}
                />
            )}
          </div>
        </div>

        <div className="border-t">
          {user && userPlan === "free" && isExpanded && (
            <div className="p-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-blue-500/80 text-primary-foreground">
                <p className="font-medium text-sm mb-1">Unlock Full Power</p>
                <p className="text-xs opacity-90 mb-3">
                  Get advanced analytics, unlimited alerts & more.
                </p>
                <Link
                  href="/upgrade"
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1.5 rounded-lg transition-all"
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

function SidebarSection({ title, items, pathname, isCollapsed, user }: { title: string, items: any[], pathname: string, isCollapsed: boolean, user: any }) {
  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <h4 className="text-[11px] font-medium text-muted-foreground px-2">{title}</h4>
      )}
      {items.map(
        (item) => {
            const isLocked = item.locked || (item.authRequired && !user);
            const isButton = !!item.onClick;

            const content = (
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-2.5 text-sm font-medium transition-all w-full",
                        pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/40",
                        isCollapsed ? "justify-center" : "",
                        isLocked && "cursor-not-allowed"
                    )}
                >
                    <div className="relative">
                        {item.icon}
                        {isLocked && !isCollapsed && (
                        <Lock
                            size={12}
                            className="absolute -top-1 -right-1 text-yellow-500"
                        />
                        )}
                    </div>
                    {!isCollapsed && item.label}
                </div>
            );

            return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <span>
                    {isButton ? (
                        <button onClick={item.onClick} disabled={isLocked} className="w-full">
                            {content}
                        </button>
                    ) : (
                        <Link
                            href={isLocked ? '#' : item.href}
                            className={cn(isLocked && 'pointer-events-none')}
                        >
                            {content}
                        </Link>
                    )}
                </span>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          )
        }
      )}
    </div>
  );
}
