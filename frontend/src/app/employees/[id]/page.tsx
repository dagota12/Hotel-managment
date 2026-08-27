"use client";

import { useParams } from "next/navigation";
import { useEmployee } from "@/hooks/use-employees";
import { useEmployeeAttendance } from "@/hooks/use-attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function calculateTotalHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return "—";
  
  const [inHours, inMins] = checkIn.split(":").map(Number);
  const [outHours, outMins] = checkOut.split(":").map(Number);
  
  let totalMins = (outHours * 60 + outMins) - (inHours * 60 + inMins);
  if (totalMins < 0) totalMins += 24 * 60; // Handle overnight shifts
  
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  
  return `${hours}h ${mins}m`;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: employee, isLoading: isEmployeeLoading } = useEmployee(id);
  const { data: attendanceData, isLoading: isAttendanceLoading } = useEmployeeAttendance(id);

  if (isEmployeeLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-[400px] items-center justify-center text-destructive">
        Employee not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" render={<Link href="/employees" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{employee.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            {employee.department.name} • {employee.role.name} • {employee.shift.name} ({employee.shift.startTime} - {employee.shift.endTime})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isAttendanceLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Check-out Time</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No attendance records found for this employee.
                      </TableCell>
                    </TableRow>
                  )}
                  {attendanceData?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell className="font-medium">
                        <span className={record.status === "LATE" ? "text-amber-500" : record.status === "PRESENT" ? "text-green-500" : ""}>
                          {record.checkIn || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.checkOut || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {calculateTotalHours(record.checkIn, record.checkOut)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
