export interface DepartmentAttendanceReportRow {
  departmentId: string;
  departmentName: string;
  employees: number;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
}
