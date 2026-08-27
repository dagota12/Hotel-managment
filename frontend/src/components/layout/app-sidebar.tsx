"use client";

import {
  BarChart3,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Users2,
  Hotel,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users2 },
  { href: "/attendance", label: "Today's Attendance", icon: CalendarClock },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/management", label: "Management", icon: ClipboardList },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="border-b border-border bg-card/90 px-4 py-4 backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      {/* Logo / Brand Header */}
      <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 px-4 py-3.5 shadow-xs">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Hotel className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold tracking-tight text-foreground truncate">
            Hotel HR Management
          </p>
          <p className="text-xs font-medium text-slate-400 truncate">Staff & Operations Console</p>
        </div>
      </div>

      {/* Sidebar Navigation Menu */}
      <div className="mt-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigation
        </p>
        <nav className="mt-2 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isItemActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-xs"
                    : "border border-transparent text-slate-300 hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-primary stroke-[2.5]" : "text-slate-400 group-hover:text-foreground"
                  )}
                />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="mt-auto pt-8">
        <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200">System Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Connected to REST API v1.0</p>
        </div>
      </div>
    </aside>
  );
}
