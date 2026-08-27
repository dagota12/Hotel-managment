"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Users2, Loader2 } from "lucide-react";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { useRoles } from "@/hooks/use-roles";
import { useShifts } from "@/hooks/use-shifts";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const { data: employees, isLoading, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const { data: departments } = useDepartments();
  const { data: roles } = useRoles();
  const { data: shifts } = useShifts();

  // Filters
  const [search, setSearch] = useState("");
  const [depFilter, setDepFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");

  // Create Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit Form
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editShiftId, setEditShiftId] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(emp => {
      const matchSearch = emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase());
      const matchDep = depFilter === "all" || emp.department?.name === depFilter;
      const matchRole = roleFilter === "all" || emp.role?.name === roleFilter;
      const matchShift = shiftFilter === "all" || emp.shift?.name === shiftFilter;
      return matchSearch && matchDep && matchRole && matchShift;
    });
  }, [employees, search, depFilter, roleFilter, shiftFilter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee.mutate(
      { fullName, email, phone, departmentId, roleId, shiftId },
      {
        onSuccess: () => {
          setFullName(""); setEmail(""); setPhone("");
          setDepartmentId(""); setRoleId(""); setShiftId("");
          setIsCreateOpen(false);
        },
      }
    );
  };

  const openEditDialog = (emp: Employee) => {
    setEditEmployeeId(emp.id);
    setEditFullName(emp.fullName);
    setEditEmail(emp.email);
    setEditPhone(emp.phone || "");
    setEditDepartmentId(emp.department.id);
    setEditRoleId(emp.role.id);
    setEditShiftId(emp.shift.id);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmployeeId) return;
    updateEmployee.mutate(
      {
        id: editEmployeeId,
        dto: {
          fullName: editFullName, email: editEmail, phone: editPhone,
          departmentId: editDepartmentId, roleId: editRoleId, shiftId: editShiftId,
        },
      },
      { onSuccess: () => setEditEmployeeId(null) }
    );
  };

  return (
    <section className="space-y-6">
      {/* Edit Dialog */}
      <Dialog open={!!editEmployeeId} onOpenChange={(open) => !open && setEditEmployeeId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <Input placeholder="Full Name" value={editFullName} onChange={e => setEditFullName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <Input type="email" placeholder="Email Address" value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone Number</label>
              <Input placeholder="Phone Number (Optional)" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Department</label>
                <Select value={editDepartmentId} onValueChange={v => setEditDepartmentId(v || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Department...">
                      {departments?.find(d => d.id === editDepartmentId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role</label>
                <Select value={editRoleId} onValueChange={v => setEditRoleId(v || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role...">
                      {roles?.find(r => r.id === editRoleId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Assigned Shift</label>
                <Select value={editShiftId} onValueChange={v => setEditShiftId(v || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Shift...">
                      {shifts?.find(s => s.id === editShiftId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {shifts?.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
              <Button type="submit" disabled={updateEmployee.isPending}>
                {updateEmployee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <Card>
        <CardContent className="pt-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Employees</p>
              <h1 className="mt-2 text-3xl font-semibold text-foreground">Manage employees</h1>
              <p className="mt-2 text-sm text-muted-foreground">{employees?.length || 0} employees</p>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger render={
                <Button><Users2 className="h-4 w-4" /> Add Employee</Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Full Name</label>
                    <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <Input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Phone Number</label>
                    <Input placeholder="Phone Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Department</label>
                      <Select value={departmentId} onValueChange={v => setDepartmentId(v || "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Department...">
                            {departments?.find(d => d.id === departmentId)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {departments?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Role</label>
                      <Select value={roleId} onValueChange={v => setRoleId(v || "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Role...">
                            {roles?.find(r => r.id === roleId)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-foreground">Assigned Shift</label>
                      <Select value={shiftId} onValueChange={v => setShiftId(v || "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Shift...">
                            {shifts?.find(s => s.id === shiftId)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {shifts?.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
                    <Button type="submit" disabled={createEmployee.isPending}>
                      {createEmployee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Employee
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {/* Filters Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <Input
            placeholder="Search employees..."
            className="max-w-xs bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={depFilter} onValueChange={v => setDepFilter(v || "all")}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments?.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={v => setRoleFilter(v || "all")}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles?.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={shiftFilter} onValueChange={v => setShiftFilter(v || "all")}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts?.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employee Table — Clean Spreadsheet Style */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-48 items-center justify-center text-destructive">Failed to load employees.</div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Employee</TableHead>
                  <TableHead className="font-semibold text-foreground">Department</TableHead>
                  <TableHead className="font-semibold text-foreground">Role</TableHead>
                  <TableHead className="font-semibold text-foreground">Shift</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No matching employees found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="py-4">
                      <span className="font-medium text-foreground">{employee.fullName}</span>
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.department?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.role?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.shift?.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="xs" render={<Link href={`/employees/${employee.id}`} />}>
                          View
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => openEditDialog(employee)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive" size="xs"
                          onClick={() => deleteEmployee.mutate(employee.id)}
                          disabled={deleteEmployee.isPending}
                        >
                          Delete
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
