"use client";

import { ArrowRight, Building2, Clock3, Users2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployees } from "@/hooks/use-employees";
import { useTodayAttendance } from "@/hooks/use-attendance";
import Link from "next/link";
import { useMemo } from "react";

export default function Home() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: attendance, isLoading: attendanceLoading } = useTodayAttendance();

  const isLoading = employeesLoading || attendanceLoading;

  const stats = useMemo(() => {
    if (!employees || !attendance) return { total: 0, present: 0, late: 0, missing: 0 };
    
    const total = employees.length;
    let present = 0;
    let late = 0;
    let missing = 0;

    attendance.forEach(record => {
      if (record.status === "PRESENT") present++;
      else if (record.status === "LATE") late++;
      else if (!record.checkIn) missing++;
    });

    return { total, present, late, missing };
  }, [employees, attendance]);

  const departmentStats = useMemo(() => {
    if (!employees || !attendance) return [];
    
    const depMap = new Map<string, { total: number, present: number }>();
    
    employees.forEach(emp => {
      const depName = emp.department.name;
      if (!depMap.has(depName)) depMap.set(depName, { total: 0, present: 0 });
      depMap.get(depName)!.total++;
    });

    attendance.forEach(record => {
      if (record.checkIn) {
        if (depMap.has(record.department)) {
          depMap.get(record.department)!.present++;
        }
      }
    });

    return Array.from(depMap.entries()).map(([name, stats]) => ({
      name,
      ...stats
    })).sort((a, b) => b.total - a.total);
  }, [employees, attendance]);

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

            <Link
              href="/attendance"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
            >
              Open Today&apos;s Attendance
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Employees", value: stats.total, icon: Users2 },
              { label: "Present Today", value: stats.present, icon: Clock3 },
              { label: "Late Today", value: stats.late, icon: Building2 },
              { label: "Not Checked In", value: stats.missing, icon: Users2 },
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
                  <Link
                    href="/attendance"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View All →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
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
                      {attendance?.slice(0, 5).map((row) => (
                        <TableRow key={row.employeeId}>
                          <TableCell className="font-medium">{row.employeeName}</TableCell>
                          <TableCell className="text-muted-foreground">{row.department}</TableCell>
                          <TableCell className="text-muted-foreground">{row.shift}</TableCell>
                          <TableCell className="text-muted-foreground">{row.checkIn || "—"}</TableCell>
                          <TableCell>
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              row.status === "PRESENT" 
                                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                : row.status === "LATE"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}>
                              {row.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                  {departmentStats.map((dep) => (
                    <div
                      key={dep.name}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">{dep.name}</span>
                      <span className="text-muted-foreground">
                        {dep.total} employees · {dep.present} present
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
