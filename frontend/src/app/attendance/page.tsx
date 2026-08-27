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
import { useTodayAttendance, useCheckIn } from "@/hooks/use-attendance";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
  const { data: attendanceData, isLoading, error } = useTodayAttendance();
  const checkInMutation = useCheckIn();

  const handleCheckIn = (employeeId: string) => {
    checkInMutation.mutate(employeeId);
  };

  const today = new Date();
  const checkedInCount = attendanceData?.filter(r => r.checkInTime !== null).length || 0;
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

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        {/* Filters */}
        <Card>
          <CardContent>
            <Input placeholder="Search employee..." />
            <div className="mt-4 grid gap-3">
              {["Department", "Shift", "Status"].map((label) => (
                <select
                  key={label}
                  className="w-full rounded-lg border border-input bg-muted px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                >
                  <option>{label}</option>
                </select>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex h-48 items-center justify-center text-destructive">
                Failed to load attendance data.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData?.map((row) => (
                      <TableRow key={row.employeeId}>
                        <TableCell className="font-medium">{row.employeeName}</TableCell>
                        <TableCell className="text-muted-foreground">{row.department}</TableCell>
                        <TableCell className="text-muted-foreground">{row.shift}</TableCell>
                        <TableCell className="text-muted-foreground">{row.checkInTime || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{row.checkOutTime || "—"}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(row.employeeId)}
                            disabled={!!row.checkInTime || checkInMutation.isPending}
                          >
                            Check In
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
