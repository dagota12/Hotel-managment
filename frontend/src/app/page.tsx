import { ArrowRight, Building2, Clock3, Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardContent className="pt-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Hotel HR Console
              </p>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Hotel Employee Management
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Manage employees, attendance, departments, roles, and reports
                  from one clean dashboard built for fast hotel operations.
                </p>
              </div>
            </div>

            <a
              href="/attendance"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
            >
              Open Today&apos;s Attendance
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Employees", value: "25", icon: Users2 },
          { label: "Present Today", value: "19", icon: Clock3 },
          { label: "Late Today", value: "3", icon: Building2 },
          { label: "Not Checked In", value: "3", icon: Users2 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
                {value}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Tables Section */}
      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary">
                  Today&apos;s attendance
                </p>
                <CardTitle className="mt-1 text-xl">
                  Operational snapshot
                </CardTitle>
              </div>
              <a
                href="/attendance"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View All →
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["John Doe", "Front Office", "Morning", "08:03", "Late"],
                  ["Sarah Ali", "Housekeeping", "Morning", "07:55", "Present"],
                  ["Mike Smith", "F&B", "Evening", "—", "Not Marked"],
                ].map(([employee, department, shift, checkIn, status]) => (
                  <TableRow key={`${employee}-${shift}`}>
                    <TableCell className="font-medium">{employee}</TableCell>
                    <TableCell className="text-muted-foreground">{department}</TableCell>
                    <TableCell className="text-muted-foreground">{shift}</TableCell>
                    <TableCell className="text-muted-foreground">{checkIn}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">
              Department overview
            </p>
            <CardTitle className="text-xl">Quick summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {[
                ["Front Office", 5, 5],
                ["Housekeeping", 8, 6],
                ["Food & Beverage", 7, 5],
                ["Maintenance", 3, 2],
                ["Security", 2, 1],
              ].map(([name, employees, present]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">
                    {employees as number} employees · {present as number} present
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
