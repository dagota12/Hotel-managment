import { api } from "@/lib/axios";
import type { AttendanceRecord } from "@/types";

export type TodayAttendanceRow = {
  employeeId: string;
  employeeName: string;
  department: string;
  shift: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
};

export const attendanceService = {
  async getToday() {
    const { data } = await api.get<TodayAttendanceRow[]>("/attendance/today");
    return data;
  },

  async checkIn(employeeId: string) {
    const { data } = await api.post<AttendanceRecord>("/attendance/check-in", {
      employeeId,
    });
    return data;
  },

  async checkOut(employeeId: string) {
    const { data } = await api.post<AttendanceRecord>("/attendance/check-out", {
      employeeId,
    });
    return data;
  },
};
