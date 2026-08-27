"use client";

import { CalendarIcon, RefreshCcw, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAttendanceReport } from "@/hooks/use-attendance";
import { useEmployees } from "@/hooks/use-employees";
import type { AttendanceRecord, Employee } from "@/types";

function calculateTotalMinutes(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  let mins = (outH * 60 + outM) - (inH * 60 + inM);
  if (mins < 0) mins += 24 * 60;
  return mins;
}

function formatMinutes(totalMins: number): string {
  if (totalMins === 0) return "—";
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hours}h ${mins}m`;
}

const ITEMS_PER_PAGE = 20;

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [page, setPage] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);

  const queryParams = useMemo(() => {
    if (!range?.from || !range?.to || !isGenerated) return { from: "", to: "" };
    return {
      from: format(range.from, "yyyy-MM-dd"),
      to: format(range.to, "yyyy-MM-dd"),
      page,
      limit: ITEMS_PER_PAGE,
    };
  }, [range, page, isGenerated]);

  const { data: reportData, isLoading: isReportLoading } = useAttendanceReport(queryParams);
  const { data: employees } = useEmployees();

  const totalPages = reportData ? Math.ceil(reportData.total / ITEMS_PER_PAGE) : 0;
  const records = reportData?.data || [];

  const rangeLabel = useMemo(() => {
    if (!range?.from) return "Select a date range";
    if (!range?.to) return format(range.from, "MMM dd, yyyy");
    return `${format(range.from, "MMM dd, yyyy")} – ${format(range.to, "MMM dd, yyyy")}`;
  }, [range]);

  // Build per-employee summary from all records on this page
  const employeeSummary = useMemo(() => {
    if (!records.length) return [];
    
    const map = new Map<string, {
      name: string;
      department: string;
      present: number;
      late: number;
      absent: number;
      totalMinutes: number;
    }>();

    records.forEach((r: AttendanceRecord) => {
      const empId = r.employee?.id || "unknown";
      const empName = r.employee?.fullName || "Unknown";
      const depName = r.employee?.department?.name || "—";

      if (!map.has(empId)) {
        map.set(empId, { name: empName, department: depName, present: 0, late: 0, absent: 0, totalMinutes: 0 });
      }
      const entry = map.get(empId)!;

      if (r.status === "PRESENT") entry.present++;
      else if (r.status === "LATE") entry.late++;
      else if (r.status === "ON_LEAVE" || r.status === "ABSENT") entry.absent++;

      entry.totalMinutes += calculateTotalMinutes(r.checkIn, r.checkOut);
    });

    return Array.from(map.entries()).map(([id, stats]) => ({
      id,
      ...stats,
      total: stats.present + stats.late + stats.absent,
      rate: stats.present + stats.late > 0
        ? Math.round(((stats.present + stats.late) / (stats.present + stats.late + stats.absent)) * 100)
        : 0,
    }));
  }, [records]);

  // Department-level summary
  const departmentSummary = useMemo(() => {
    if (!employeeSummary.length) return [];
    const map = new Map<string, { employees: Set<string>; present: number; late: number; absent: number; totalMinutes: number }>();

    employeeSummary.forEach(emp => {
      if (!map.has(emp.department)) {
        map.set(emp.department, { employees: new Set(), present: 0, late: 0, absent: 0, totalMinutes: 0 });
      }
      const entry = map.get(emp.department)!;
      entry.employees.add(emp.id);
      entry.present += emp.present;
      entry.late += emp.late;
      entry.absent += emp.absent;
      entry.totalMinutes += emp.totalMinutes;
    });

    return Array.from(map.entries()).map(([name, stats]) => ({
      name,
      employees: stats.employees.size,
      present: stats.present,
      late: stats.late,
      absent: stats.absent,
      totalMinutes: stats.totalMinutes,
      total: stats.present + stats.late + stats.absent,
      rate: stats.present + stats.late > 0
        ? Math.round(((stats.present + stats.late) / (stats.present + stats.late + stats.absent)) * 100)
        : 0,
    }));
  }, [employeeSummary]);

  // Grand total hours across all records
  const grandTotalMinutes = useMemo(() => {
    return records.reduce((sum: number, r: AttendanceRecord) => sum + calculateTotalMinutes(r.checkIn, r.checkOut), 0);
  }, [records]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-2">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">
            Reports
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Attendance reports
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate summary reports by employee and department.
          </p>
        </CardContent>
      </Card>

      {/* Report Controls */}
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">
              Attendance Report
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{rangeLabel}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={() => { setIsGenerated(true); setPage(1); }} disabled={!range?.from || !range?.to}>
                <RefreshCcw className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Loading / Empty State */}
          {isGenerated && isReportLoading && (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isGenerated && !isReportLoading && records.length === 0 && (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No attendance records found for this date range.
            </div>
          )}

          {isGenerated && !isReportLoading && records.length > 0 && (
            <>
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Total Records</span>
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                      {reportData?.total ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Total Worked Hours</span>
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                      {formatMinutes(grandTotalMinutes)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Employees</span>
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                      {employeeSummary.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Employee Attendance Report */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground">
                  Employee attendance report
                </div>
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Employee</TableHead>
                      <TableHead className="font-semibold text-foreground">Department</TableHead>
                      <TableHead className="font-semibold text-foreground">Present</TableHead>
                      <TableHead className="font-semibold text-foreground">Late</TableHead>
                      <TableHead className="font-semibold text-foreground">Absent</TableHead>
                      <TableHead className="font-semibold text-foreground">Total Hours</TableHead>
                      <TableHead className="font-semibold text-foreground">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeSummary.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-foreground">{emp.name}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.present}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.late}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.absent}</TableCell>
                        <TableCell className="text-muted-foreground font-medium">{formatMinutes(emp.totalMinutes)}</TableCell>
                        <TableCell className="font-medium text-primary">{emp.rate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Department Summary */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground">
                  Department summary
                </div>
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Department</TableHead>
                      <TableHead className="font-semibold text-foreground">Employees</TableHead>
                      <TableHead className="font-semibold text-foreground">Present</TableHead>
                      <TableHead className="font-semibold text-foreground">Late</TableHead>
                      <TableHead className="font-semibold text-foreground">Absent</TableHead>
                      <TableHead className="font-semibold text-foreground">Total Hours</TableHead>
                      <TableHead className="font-semibold text-foreground">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentSummary.map((dep) => (
                      <TableRow key={dep.name} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-foreground">{dep.name}</TableCell>
                        <TableCell className="text-muted-foreground">{dep.employees}</TableCell>
                        <TableCell className="text-muted-foreground">{dep.present}</TableCell>
                        <TableCell className="text-muted-foreground">{dep.late}</TableCell>
                        <TableCell className="text-muted-foreground">{dep.absent}</TableCell>
                        <TableCell className="text-muted-foreground font-medium">{formatMinutes(dep.totalMinutes)}</TableCell>
                        <TableCell className="font-medium text-primary">{dep.rate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => {
                        const elements: React.ReactNode[] = [];
                        if (idx > 0 && arr[idx - 1] !== p - 1) {
                          elements.push(
                            <PaginationItem key={`ellipsis-${p}`}>
                              <span className="px-2 text-muted-foreground">…</span>
                            </PaginationItem>
                          );
                        }
                        elements.push(
                          <PaginationItem key={p}>
                            <PaginationLink 
                              isActive={p === page}
                              onClick={() => setPage(p)}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        );
                        return elements;
                      })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
