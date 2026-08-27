import { AttendanceStatus } from "../common/attendance-status.enum";

export interface TodayAttendanceRow {
  employeeId: string;
  recordId: string | null;
  employeeName: string;
  department: string;
  shift: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus | "NOT_MARKED";
}
