"use client";

import { ArrowRight, Building2, Clock3, Users2, Loader2, TrendingUp, Award } from "lucide-react";
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
    label: "Present",
    color: "#EAB308", // Gold
  },
  late: {
    label: "Late",
    color: "#F59E0B", // Amber
  },
} satisfies ChartConfig;

const COLORS = [
  "#EAB308", // Gold
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

export default function Home() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: attendance, isLoading: attendanceLoading } = useTodayAttendance();
  const { data: trendData, isLoading: trendLoading } = useAttendanceTrend(7);
  const { data: deptData, isLoading: deptLoading } = useDepartmentStats();

  const isLoading = employeesLoading || attendanceLoading || trendLoading || deptLoading;

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
    return Math.min(320, Math.max(90, count * 45));
  }, [deptData]);

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

          {/* Charts Section — Line Chart + Horizontal Bar Chart */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Attendance Trend — Line Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-primary">
                      Operational Trend
                    </p>
                    <CardTitle className="text-xl mt-1">Attendance — Last 7 Days</CardTitle>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Daily present vs. late check-in trendline</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendChartConfig} className="h-[260px] w-full">
                  <LineChart
                    accessibilityLayer
                    data={trendData || []}
                    margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="var(--color-present)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-present)" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="late"
                      stroke="var(--color-late)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-late)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="border-t border-border pt-3 text-xs text-muted-foreground">
                Line chart showing 7-day present (Gold) vs late (Amber) trends.
              </CardFooter>
            </Card>

            {/* Chart 2: Department Attendance Rate — Horizontal Bar Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-primary">
                      Department Insights
                    </p>
                    <CardTitle className="text-xl mt-1">Attendance Rate by Department</CardTitle>
                  </div>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Today&apos;s check-in completion rate per team</CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[300px] pr-2">
                <ChartContainer config={deptChartConfig} style={{ height: `${deptChartHeight}px` }} className="w-full">
                  <BarChart
                    layout="vertical"
                    accessibilityLayer
                    data={deptData || []}
                    margin={{ top: 10, right: 25, left: 15, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="department"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={100}
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
              <CardFooter className="border-t border-border pt-3 text-xs text-muted-foreground">
                Horizontal bar chart showing attendance percentage for each department.
              </CardFooter>
            </Card>
          </section>

          {/* Today's Attendance Table */}
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
                        <TableCell className="text-muted-foreground">{row.department}</TableCell>
                        <TableCell className="text-muted-foreground">{row.shift}</TableCell>
                        <TableCell className="font-medium">
                          <span className={
                            row.status === "LATE" ? "text-amber-500" 
                            : row.status === "PRESENT" ? "text-green-500" 
                            : "text-muted-foreground"
                          }>
                            {formatTime(row.checkIn)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                            row.status === "PRESENT" 
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
                              : row.status === "LATE"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
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
