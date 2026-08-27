"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useEmployee } from "@/hooks/use-employees";
import { useEmployeeAttendance, useUpdateAttendance } from "@/hooks/use-attendance";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AttendanceRecord } from "@/types";

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

const ITEMS_PER_PAGE = 10;

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [page, setPage] = useState(1);

  // Edit state
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const { data: employee, isLoading: isEmployeeLoading } = useEmployee(id);
  const { data: attendanceResult, isLoading: isAttendanceLoading } = useEmployeeAttendance(id, page, ITEMS_PER_PAGE);
  const updateMutation = useUpdateAttendance();

  const totalPages = attendanceResult ? Math.ceil(attendanceResult.total / ITEMS_PER_PAGE) : 0;
  const records = attendanceResult?.data || [];

  const pageTotalMins = useMemo(() => {
    return records.reduce((sum, r) => sum + calculateTotalMinutes(r.checkIn, r.checkOut), 0);
  }, [records]);

  const openEdit = (record: AttendanceRecord) => {
    setEditRecord(record);
    setEditCheckIn(record.checkIn || "");
    setEditCheckOut(record.checkOut || "");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    updateMutation.mutate(
      {
        id: editRecord.id,
        dto: {
          checkIn: editCheckIn || undefined,
          checkOut: editCheckOut || undefined,
        },
      },
      { onSuccess: () => setEditRecord(null) }
    );
  };

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
      {/* Edit Attendance Dialog */}
      <Dialog open={!!editRecord} onOpenChange={(open) => !open && setEditRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance — {editRecord?.date}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Check-In Time</label>
                <input
                  type="time"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                  value={editCheckIn}
                  onChange={e => setEditCheckIn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Check-Out Time</label>
                <input
                  type="time"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                  value={editCheckOut}
                  onChange={e => setEditCheckOut(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Total Records</span>
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {attendanceResult?.total ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Page Worked Hours</span>
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {formatMinutes(pageTotalMins)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Avg Hours / Day</span>
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {records.length > 0 ? formatMinutes(Math.round(pageTotalMins / records.length)) : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Log</CardTitle>
            {attendanceResult && (
              <span className="text-sm text-muted-foreground">
                Showing {records.length} of {attendanceResult.total} records
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAttendanceLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Date</TableHead>
                      <TableHead className="font-semibold text-foreground">Check-in Time</TableHead>
                      <TableHead className="font-semibold text-foreground">Check-out Time</TableHead>
                      <TableHead className="font-semibold text-foreground">Total Hours</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No attendance records found for this employee.
                        </TableCell>
                      </TableRow>
                    )}
                    {records.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-foreground py-4">{record.date}</TableCell>
                        <TableCell className="font-medium">
                          <span className={
                            record.status === "LATE" ? "text-amber-500"
                            : record.status === "PRESENT" ? "text-green-500"
                            : ""
                          }>
                            {record.checkIn || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.checkOut || "—"}</TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {formatMinutes(calculateTotalMinutes(record.checkIn, record.checkOut))}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                            record.status === "PRESENT"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : record.status === "LATE"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button variant="outline" size="xs" onClick={() => openEdit(record)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
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
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
