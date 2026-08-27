"use client";

import { CalendarIcon, RefreshCcw } from "lucide-react";
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

const employeeRows = [
  ["John Doe", "Front Office", 20, 2, 1, "95.2%"],
  ["Sarah Ali", "Housekeeping", 18, 1, 3, "81.8%"],
  ["Mike Smith", "F&B", 21, 0, 0, "100%"],
];

const departmentRows = [
  ["Front Office", 5, 95, 3, 2, "95%"],
  ["Housekeeping", 8, 140, 9, 11, "87.5%"],
  ["F&B", 7, 130, 4, 5, "93%"],
];

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 27),
  });

  const rangeLabel = useMemo(() => {
    if (!range?.from) return "Select a date range";
    if (!range?.to) return format(range.from, "MMM dd, yyyy");
    return `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`;
  }, [range]);

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

      {/* Report Controls & Tables */}
      <Card>
        <CardContent className="space-y-6">
          {/* Controls */}
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

              <Button>
                <RefreshCcw className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Employee Attendance Report */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
              Employee attendance report
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeRows.map(
                  ([employee, department, present, late, absent, rate]) => (
                    <TableRow key={`${employee}-${department}`}>
                      <TableCell className="font-medium">{employee}</TableCell>
                      <TableCell className="text-muted-foreground">{department}</TableCell>
                      <TableCell className="text-muted-foreground">{present}</TableCell>
                      <TableCell className="text-muted-foreground">{late}</TableCell>
                      <TableCell className="text-muted-foreground">{absent}</TableCell>
                      <TableCell className="font-medium text-primary">{rate}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>

          {/* Department Summary */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
              Department summary
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentRows.map(
                  ([department, employees, present, late, absent, rate]) => (
                    <TableRow key={department as string}>
                      <TableCell className="font-medium">{department}</TableCell>
                      <TableCell className="text-muted-foreground">{employees}</TableCell>
                      <TableCell className="text-muted-foreground">{present}</TableCell>
                      <TableCell className="text-muted-foreground">{late}</TableCell>
                      <TableCell className="text-muted-foreground">{absent}</TableCell>
                      <TableCell className="font-medium text-primary">{rate}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
