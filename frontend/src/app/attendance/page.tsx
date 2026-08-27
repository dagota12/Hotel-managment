"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useTodayAttendance, useCheckIn, useCheckOut, useUpdateAttendance } from "@/hooks/use-attendance";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { TodayAttendanceRow } from "@/services/attendance.service";

export default function AttendancePage() {
  const { data: attendanceData, isLoading, error } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const updateMutation = useUpdateAttendance();

  // Filter States
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit States
  const [editRecord, setEditRecord] = useState<TodayAttendanceRow | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const handleCheckIn = (employeeId: string) => {
    checkInMutation.mutate(employeeId);
  };

  const handleCheckOut = (employeeId: string) => {
    checkOutMutation.mutate(employeeId);
  };

  const openEdit = (row: TodayAttendanceRow) => {
    if (!row.recordId) return; // Cannot edit if not marked yet
    setEditRecord(row);
    setEditCheckIn(row.checkIn || "");
    setEditCheckOut(row.checkOut || "");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord?.recordId) return;

    updateMutation.mutate(
      {
        id: editRecord.recordId,
        dto: {
          checkIn: editCheckIn || undefined,
          checkOut: editCheckOut || undefined,
        },
      },
      {
        onSuccess: () => setEditRecord(null),
      }
    );
  };

  const today = new Date();
  
  // Dynamic Options for Selects based on data
  const departments = Array.from(new Set(attendanceData?.map(r => r.department) || []));
  const shifts = Array.from(new Set(attendanceData?.map(r => r.shift) || []));

  // Filtered Data
  const filteredData = useMemo(() => {
    if (!attendanceData) return [];
    return attendanceData.filter(row => {
      const matchSearch = row.employeeName.toLowerCase().includes(search.toLowerCase());
      const matchDep = departmentFilter === "all" || row.department === departmentFilter;
      const matchShift = shiftFilter === "all" || row.shift === shiftFilter;
      
      let matchStatus = true;
      if (statusFilter !== "all") {
        if (statusFilter === "PENDING") matchStatus = row.status === "NOT_MARKED";
        else matchStatus = row.status === statusFilter;
      }

      return matchSearch && matchDep && matchShift && matchStatus;
    });
  }, [attendanceData, search, departmentFilter, shiftFilter, statusFilter]);

  const checkedInCount = attendanceData?.filter(r => r.checkIn !== null).length || 0;
  const totalEmployees = attendanceData?.length || 0;

  return (
    <section className="space-y-6">
      {/* Edit Dialog */}
      <Dialog open={!!editRecord} onOpenChange={(open) => !open && setEditRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance - {editRecord?.employeeName}</DialogTitle>
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
          <Input 
            placeholder="Search employee..." 
            className="max-w-xs bg-background" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={departmentFilter} onValueChange={v => setDepartmentFilter(v || "all")}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={shiftFilter} onValueChange={v => setShiftFilter(v || "all")}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={v => setStatusFilter(v || "all")}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PRESENT">Present</SelectItem>
                <SelectItem value="LATE">Late</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
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
                  <TableHead className="font-semibold text-foreground text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No matching records found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredData.map((row) => (
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
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-2">
                        {row.recordId && (
                          <Button 
                            size="xs" 
                            variant="outline"
                            onClick={() => openEdit(row)}
                          >
                            Edit
                          </Button>
                        )}
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
