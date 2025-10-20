
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Trophy,
  BarChart3,
  User,
  LogOut,
  ArrowLeftRight,
  Star,
  Lock,
  Compass,
  Eye,
  Wallet,
  Rss,
  Settings,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { useLogout } from "../auth/auth-actions";


export default function Sidebar({ isCollapsed, onCollapseToggle }: { isCollapsed: boolean, onCollapseToggle: () => void }) {
  const pathname = usePathname();
  const { claims } = useUser();
  const logout = useLogout();
  const userPlan = claims?.plan || 'free';

  const navItems = [
    {
      label: "Whale Feed",
      icon: <Rss size={18} />,
      href: "/feed",
      visibleFor: ["free", "pro"],
    },
    {
      label: "Explore",
      icon: <Compass size={18} />,
      href: "/leaderboard",
      visibleFor: ["free", "pro"],
    },
    {
      label: "Watchlist",
      icon: <Eye size={18} />,
      href: "/watchlist",
      visibleFor: ["free", "pro"],
    },
    {
      label: "Alerts",
      icon: <Bell size={18} />,
      href: "/alerts",
      visibleFor: ["free", "pro"],
    },
    {
      label: "Portfolio",
      icon: <Wallet size={18} />,
      href: "/portfolio",
      visibleFor: ["free", "pro"],
    },
  ];

  const analyticsItems = [
    {
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      href: "/analytics",
      visibleFor: ["pro"],
      locked: userPlan === "free",
    },
  ];

  const accountItems = [
    {
      label: "My Account",
      icon: <Settings size={18} />,
      href: "/account",
      visibleFor: ["free", "pro"],
    },
    {
      label: "Log Out",
      icon: <LogOut size={18} />,
      href: "#",
      onClick: logout,
      visibleFor: ["free", "pro"],
    },
  ];

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "h-screen border-r border-border bg-card flex flex-col justify-between transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div>
          {/* Header / Logo */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border h-14 lg:h-[60px]">
            {!isCollapsed && <span className="text-lg font-semibold">Track100x</span>}
            <button
              className="p-2 rounded-md hover:bg-muted"
              onClick={onCollapseToggle}
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="px-3 py-4 space-y-6">
            {/* Section: Core */}
            <SidebarSection
              title="CORE"
              items={navItems}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />

            {/* Section: Analytics */}
            <SidebarSection
              title="ANALYTICS"
              items={analyticsItems}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />

            {/* Section: Account */}
            <SidebarSection
              title="ACCOUNT"
              items={accountItems}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        {/* Upgrade CTA */}
        {userPlan === "free" && !isCollapsed && (
          <div className="p-4 border-t border-border">
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
      </aside>
    </TooltipProvider>
  );
}

/* ---- Helper Component: Sidebar Section ---- */
function SidebarSection({ title, items, pathname, isCollapsed }) {
  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <h4 className="text-[11px] font-medium text-muted-foreground px-2">{title}</h4>
      )}
      {items.map(
        (item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2.5 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/40",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <div className="relative">
                    {item.icon}
                    {item.locked && (
                      <Lock
                        size={12}
                        className="absolute -top-1 -right-1 text-yellow-500"
                      />
                    )}
                  </div>
                  {!isCollapsed && item.label}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          )
      )}
    </div>
  );
}
