"use client";

import { useState, useEffect } from "react";
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

  // Create Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit Form states
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editShiftId, setEditShiftId] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee.mutate(
      { fullName, email, phone, departmentId, roleId, shiftId },
      {
        onSuccess: () => {
          setFullName("");
          setEmail("");
          setPhone("");
          setDepartmentId("");
          setRoleId("");
          setShiftId("");
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
          fullName: editFullName, 
          email: editEmail, 
          phone: editPhone, 
          departmentId: editDepartmentId, 
          roleId: editRoleId, 
          shiftId: editShiftId 
        } 
      },
      {
        onSuccess: () => {
          setEditEmployeeId(null);
        },
      }
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
            <Input 
              placeholder="Full Name" 
              value={editFullName} 
              onChange={e => setEditFullName(e.target.value)}
              required
            />
            <Input 
              type="email"
              placeholder="Email Address" 
              value={editEmail} 
              onChange={e => setEditEmail(e.target.value)}
              required
            />
            <Input 
              placeholder="Phone Number (Optional)" 
              value={editPhone} 
              onChange={e => setEditPhone(e.target.value)}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                value={editDepartmentId}
                onChange={e => setEditDepartmentId(e.target.value)}
                required
              >
                <option value="" disabled>Select Department...</option>
                {departments?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                value={editRoleId}
                onChange={e => setEditRoleId(e.target.value)}
                required
              >
                <option value="" disabled>Select Role...</option>
                {roles?.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              
              <select
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 sm:col-span-2"
                value={editShiftId}
                onChange={e => setEditShiftId(e.target.value)}
                required
              >
                <option value="" disabled>Select Shift...</option>
                {shifts?.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
                ))}
              </select>
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
              <p className="text-xs uppercase tracking-[0.28em] text-primary">
                Employees
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-foreground">
                Manage employees
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {employees?.length || 0} employees
              </p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger render={
                <Button>
                  <Users2 className="h-4 w-4" />
                  Add Employee
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <Input 
                    placeholder="Full Name" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                  <Input 
                    type="email"
                    placeholder="Email Address" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Phone Number (Optional)" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <select
                      className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                      value={departmentId}
                      onChange={e => setDepartmentId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Department...</option>
                      {departments?.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>

                    <select
                      className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
                      value={roleId}
                      onChange={e => setRoleId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Role...</option>
                      {roles?.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    
                    <select
                      className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 sm:col-span-2"
                      value={shiftId}
                      onChange={e => setShiftId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Shift...</option>
                      {shifts?.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
                      ))}
                    </select>
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

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <Card>
          <CardContent>
            <Input placeholder="Search employees..." />
            <div className="mt-4 grid gap-3">
              {["Department", "Role", "Shift", "Status"].map((label) => (
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

        {/* Employee Table */}
        <Card>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex h-48 items-center justify-center text-destructive">
                Failed to load employees.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees?.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.fullName}
                          <div className="text-xs text-muted-foreground font-normal">{employee.email}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{employee.department?.name}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.role?.name}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.shift?.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="xs"
                              render={<Link href={`/employees/${employee.id}`} />}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="xs"
                              onClick={() => openEditDialog(employee)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="xs"
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
