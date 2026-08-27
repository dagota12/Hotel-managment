"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTodayAttendance, useCheckIn, useCheckOut } from "@/hooks/use-attendance";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
  const { data: attendanceData, isLoading, error } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const handleCheckIn = (employeeId: string) => {
    checkInMutation.mutate(employeeId);
  };

  const handleCheckOut = (employeeId: string) => {
    checkOutMutation.mutate(employeeId);
  };

  const today = new Date();
  const checkedInCount = attendanceData?.filter(r => r.checkIn !== null).length || 0;
  const totalEmployees = attendanceData?.length || 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-2">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">
            Today&apos;s Attendance
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            {format(today, "EEEE, MMMM dd, yyyy")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {checkedInCount} / {totalEmployees} employees checked in
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {/* Filters Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <Input placeholder="Search employee..." className="max-w-xs bg-background" />
          <div className="flex gap-3 w-full sm:w-auto">
            {["Department", "Shift", "Status"].map((label) => (
              <select
                key={label}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
              >
                <option>{label}</option>
              </select>
            ))}
          </div>
        </div>

        {/* Attendance Table Clean */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-48 items-center justify-center text-destructive">
            Failed to load attendance data.
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Employee</TableHead>
                  <TableHead className="font-semibold text-foreground">Department</TableHead>
                  <TableHead className="font-semibold text-foreground">Shift</TableHead>
                  <TableHead className="font-semibold text-foreground">Check In</TableHead>
                  <TableHead className="font-semibold text-foreground">Check Out</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData?.map((row) => (
                  <TableRow key={row.employeeId} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground py-4">{row.employeeName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.department}</TableCell>
                    <TableCell className="text-muted-foreground">{row.shift}</TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {row.checkIn || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {row.checkOut || "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === "PRESENT" 
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
                          : row.status === "LATE"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                      }`}>
                        {row.status === "NOT_MARKED" ? "Pending" : row.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="xs" 
                          variant={row.checkIn ? "outline" : "default"}
                          onClick={() => handleCheckIn(row.employeeId)}
                          disabled={!!row.checkIn || checkInMutation.isPending}
                        >
                          Check In
                        </Button>
                        <Button 
                          size="xs"
                          variant={row.checkOut ? "outline" : "secondary"}
                          onClick={() => handleCheckOut(row.employeeId)}
                          disabled={!row.checkIn || !!row.checkOut || checkOutMutation.isPending}
                        >
                          Check Out
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
