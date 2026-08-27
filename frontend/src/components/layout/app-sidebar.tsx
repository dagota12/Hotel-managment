import {
  BarChart3,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Users2,
  WandSparkles,
} from "lucide-react";
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
    <aside className="border-b border-border bg-sidebar px-4 py-4 backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <WandSparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Hotel Management
          </p>
          <p className="text-xs text-muted-foreground">Employee operations</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 grid gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
          >
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </Link>
        ))}
      </nav>

    </aside>
  );
}
