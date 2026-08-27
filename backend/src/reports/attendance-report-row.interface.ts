export interface AttendanceReportRow {
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
}
