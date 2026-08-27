import { BarChart3, CalendarClock, ClipboardList, LayoutDashboard, Users2, WandSparkles } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users2 },
  { href: "/attendance", label: "Today's Attendance", icon: CalendarClock },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/management", label: "Management", icon: ClipboardList },
];

export function AppSidebar() {
  return (
    <aside className="border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
          <WandSparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-50">Hotel Management</p>
          <p className="text-xs text-slate-400">Employee operations</p>
        </div>
      </div>

      <nav className="mt-6 grid gap-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-slate-50"
          >
            <Icon className="h-4 w-4 text-amber-300" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-3xl border border-amber-400/15 bg-amber-400/10 p-4 text-sm text-amber-100">
        Start with layout, then build employees, attendance, dashboard, reports,
        and management.
      </div>
    </aside>
  );
}