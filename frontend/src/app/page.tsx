"use client";

import { Users2, UserCheck, Clock, AlertCircle, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { useEmployees } from "@/hooks/use-employees";
import { useTodayAttendance, useAttendanceTrend, useDepartmentStats } from "@/hooks/use-attendance";
import { formatTime } from "@/lib/format-time";
import Link from "next/link";
import { useMemo } from "react";

const trendChartConfig = {
  present: {
    label: "On Time",
    color: "#EAB308", // Primary Gold
  },
  late: {
    label: "Late",
    color: "#F59E0B", // Amber
  },
} satisfies ChartConfig;

const COLORS = [
  "#EAB308", // Gold
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#14B8A6", // Teal
  "#EC4899", // Pink
];

export default function Home() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: attendance, isLoading: attendanceLoading } = useTodayAttendance();
  const { data: trendData, isLoading: trendLoading } = useAttendanceTrend(7);
  const { data: deptData, isLoading: deptLoading } = useDepartmentStats();

  const isLoading = employeesLoading || attendanceLoading || trendLoading || deptLoading;

  // Clear metric logic: Total, On Time, Late, Not Checked In
  const stats = useMemo(() => {
    if (!employees || !attendance) return { total: 0, onTime: 0, late: 0, missing: 0 };
    
    const total = employees.length;
    let onTime = 0;
    let late = 0;
    let missing = 0;

    attendance.forEach(record => {
      if (record.status === "PRESENT") onTime++;
      else if (record.status === "LATE") late++;
      else if (!record.checkIn) missing++;
    });

    return { total, onTime, late, missing };
  }, [employees, attendance]);

  const deptChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    (deptData || []).forEach((item, index) => {
      config[item.department] = {
        label: item.department,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [deptData]);

  // Compute dynamic chart height so bars stay tight and compact without huge vertical gaps
  const deptChartHeight = useMemo(() => {
    const count = (deptData || []).length;
    if (count === 0) return 120;
    return Math.min(300, Math.max(90, count * 45));
  }, [deptData]);

  return (
    <div className="space-y-6">
      {/* Compact Top Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-300">
            Real-time overview of attendance, team statistics, and operations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* KPI Metrics Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-300">Total Employees</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-300">On Time Today</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-emerald-400">
                  {stats.onTime}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-300">Late Today</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-amber-400">
                  {stats.late}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-300">Not Checked In</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-rose-400">
                  {stats.missing}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Charts Section */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Attendance Trend — Line Chart */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Operational Trend
                    </p>
                    <CardTitle className="text-xl mt-0.5">Attendance — Last 7 Days</CardTitle>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardDescription className="text-slate-300">
                  Daily comparison of on-time vs. late check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendChartConfig} className="h-[240px] w-full">
                  <LineChart
                    accessibilityLayer
                    data={trendData || []}
                    margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} domain={[0, 'auto']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="present"
                      name="On Time"
                      stroke="var(--color-present)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-present)" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="late"
                      name="Late"
                      stroke="var(--color-late)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-late)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex items-center gap-6 border-t border-border/40 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span>On Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Late</span>
                </div>
              </CardFooter>
            </Card>

            {/* Chart 2: Department Attendance Rate — Horizontal Bar Chart */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Department Insights
                    </p>
                    <CardTitle className="text-xl mt-0.5">Attendance Rate by Department</CardTitle>
                  </div>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <CardDescription className="text-slate-300">
                  Today&apos;s check-in completion rate per team
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[280px] pr-2">
                <ChartContainer config={deptChartConfig} style={{ height: `${deptChartHeight}px` }} className="w-full">
                  <BarChart
                    layout="vertical"
                    accessibilityLayer
                    data={deptData || []}
                    margin={{ top: 10, right: 25, left: 15, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="department"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={90}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rate" maxBarSize={16} radius={[0, 4, 4, 0]}>
                      {(deptData || []).map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-3 text-xs text-slate-300">
                {(deptData || []).map((d, idx) => (
                  <div key={d.department} className="flex items-center gap-1.5 rounded-md border border-border/50 bg-accent/40 px-2.5 py-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-semibold text-foreground">{d.department}:</span>
                    <span className="text-slate-200">{d.rate}% ({d.present}/{d.employees})</span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </section>

          {/* Today's Attendance Snapshot Table */}
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Today&apos;s attendance
                  </p>
                  <CardTitle className="mt-0.5 text-xl">
                    Operational snapshot
                  </CardTitle>
                </div>
                <Link
                  href="/attendance"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Employee</TableHead>
                      <TableHead className="font-semibold text-foreground">Department</TableHead>
                      <TableHead className="font-semibold text-foreground">Shift</TableHead>
                      <TableHead className="font-semibold text-foreground">Check In Time</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance?.slice(0, 6).map((row) => (
                      <TableRow key={row.employeeId} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-foreground py-3.5">{row.employeeName}</TableCell>
                        <TableCell className="text-slate-300">{row.department}</TableCell>
                        <TableCell className="text-slate-300">{row.shift}</TableCell>
                        <TableCell className="font-medium">
                          <span className={
                            row.status === "LATE" ? "text-amber-400 font-semibold" 
                            : row.status === "PRESENT" ? "text-emerald-400 font-semibold" 
                            : "text-slate-400"
                          }>
                            {formatTime(row.checkIn)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                            row.status === "PRESENT" 
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                              : row.status === "LATE"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
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
        </>
      )}
    </div>
  );
}
