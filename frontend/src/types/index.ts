export type Department = {
  id: string;
  name: string;
};

export type Role = {
  id: string;
  name: string;
};

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type Employee = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  department: Department;
  role: Role;
  shift: Shift;
};

export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  note: string | null;
  employee: Employee;
};

export type AttendanceSummaryRow = {
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  shift: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
};

export type DepartmentSummaryRow = {
  departmentId: string;
  departmentName: string;
  employees: number;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
};