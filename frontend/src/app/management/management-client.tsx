"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useDepartments, useCreateDepartment, useDeleteDepartment } from "@/hooks/use-departments";
import { useRoles, useCreateRole, useDeleteRole } from "@/hooks/use-roles";
import { useShifts, useCreateShift, useDeleteShift } from "@/hooks/use-shifts";

export function ManagementClient() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Roles" | "Shifts">("Departments");

  const depsQuery = useDepartments();
  const createDep = useCreateDepartment();
  const deleteDep = useDeleteDepartment();

  const rolesQuery = useRoles();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  const shiftsQuery = useShifts();
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  // Form states
  const [depName, setDepName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [shiftName, setShiftName] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");

  const handleCreateDep = (e: React.FormEvent) => {
    e.preventDefault();
    createDep.mutate({ name: depName }, { onSuccess: () => setDepName("") });
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    createRole.mutate({ name: roleName }, { onSuccess: () => setRoleName("") });
  };

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    createShift.mutate({ name: shiftName, startTime: shiftStart, endTime: shiftEnd }, { 
      onSuccess: () => {
        setShiftName("");
        setShiftStart("");
        setShiftEnd("");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex gap-2">
            {(["Departments", "Roles", "Shifts"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {/* Departments */}
            {activeTab === "Departments" && (
              <Card className="bg-muted/30 col-span-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">Departments</CardTitle>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="xs">+ Add Department</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Department</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateDep} className="space-y-4">
                          <Input 
                            placeholder="Department Name (e.g. Front Office)" 
                            value={depName} 
                            onChange={e => setDepName(e.target.value)}
                            required
                          />
                          <DialogFooter>
                            <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
                            <Button type="submit" disabled={createDep.isPending}>
                              {createDep.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {depsQuery.isLoading ? (
                           <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
                        ) : depsQuery.data?.map((dep) => (
                          <TableRow key={dep.id}>
                            <TableCell className="font-medium">{dep.name}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="xs" 
                                onClick={() => deleteDep.mutate(dep.id)}
                                disabled={deleteDep.isPending}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roles */}
            {activeTab === "Roles" && (
              <Card className="bg-muted/30 col-span-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">Roles</CardTitle>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="xs">+ Add Role</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Role</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateRole} className="space-y-4">
                          <Input 
                            placeholder="Role Name (e.g. Receptionist)" 
                            value={roleName} 
                            onChange={e => setRoleName(e.target.value)}
                            required
                          />
                          <DialogFooter>
                            <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
                            <Button type="submit" disabled={createRole.isPending}>
                              {createRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rolesQuery.isLoading ? (
                           <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
                        ) : rolesQuery.data?.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="xs" 
                                onClick={() => deleteRole.mutate(role.id)}
                                disabled={deleteRole.isPending}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shifts */}
            {activeTab === "Shifts" && (
              <Card className="bg-muted/30 col-span-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">Shifts</CardTitle>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="xs">+ Add Shift</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Shift</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateShift} className="space-y-4">
                          <Input 
                            placeholder="Shift Name (e.g. Morning)" 
                            value={shiftName} 
                            onChange={e => setShiftName(e.target.value)}
                            required
                          />
                          <div className="flex gap-4">
                            <Input 
                              type="time"
                              placeholder="Start Time" 
                              value={shiftStart} 
                              onChange={e => setShiftStart(e.target.value)}
                              required
                            />
                            <Input 
                              type="time"
                              placeholder="End Time" 
                              value={shiftEnd} 
                              onChange={e => setShiftEnd(e.target.value)}
                              required
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose render={<Button type="button" variant="ghost">Cancel</Button>} />
                            <Button type="submit" disabled={createShift.isPending}>
                              {createShift.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Shift</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shiftsQuery.isLoading ? (
                           <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                        ) : shiftsQuery.data?.map((shift) => (
                          <TableRow key={shift.id}>
                            <TableCell className="font-medium">{shift.name}</TableCell>
                            <TableCell className="text-muted-foreground">{shift.startTime}</TableCell>
                            <TableCell className="text-muted-foreground">{shift.endTime}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="xs" 
                                onClick={() => deleteShift.mutate(shift.id)}
                                disabled={deleteShift.isPending}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
