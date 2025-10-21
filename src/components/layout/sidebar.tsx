
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
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
    return item;
  });

  const handleToggle = () => {
    onToggle();
    // Dispatch a custom event that the header can listen to
    window.dispatchEvent(new CustomEvent('sidebarToggle'));
  }


  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 z-40 border-r bg-background fixed h-full top-0",
          "pt-14 lg:pt-[60px]",
          isExpanded ? "w-60" : "w-[72px]"
        )}
      >
        <div className="flex items-center h-14 lg:h-[60px] border-b px-6 absolute top-0 bg-background w-full">
             <Link href="/" className="flex items-center space-x-2">
                <LogoIcon />
                <span className={cn("font-bold transition-opacity duration-300 whitespace-nowrap", isExpanded ? "opacity-100" : "opacity-0")}>Track100x</span>
            </Link>
        </div>

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
                onClick={handleToggle}
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
        const isLocked = item.authRequired && !user;
        const isActive = pathname === item.href;
        const isButton = !!item.onClick;
        const href = item.href;

        const content = (
            <div className="relative flex items-center gap-3 overflow-hidden">
                <div className="relative shrink-0">{item.icon}</div>
                <span
                className={cn(
                    "whitespace-nowrap transition-all duration-200",
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                )}
                >
                {item.label}
                </span>
                {isLocked && isExpanded && (
                <Lock
                    size={12}
                    className="ml-auto text-yellow-500 shrink-0"
                />
                )}
          </div>
        );
        
        const sharedClasses = cn(
            "relative flex items-center rounded-lg py-2.5 text-sm font-semibold transition-all w-full",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            isExpanded ? "px-4" : "justify-center"
          );

        return (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <span className="relative">
                 {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"></div>}
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
                {item.label} {isLocked && "(Requires Login)"}
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
}
