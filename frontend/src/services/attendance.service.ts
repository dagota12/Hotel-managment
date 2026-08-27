import { api } from "@/lib/axios";
import type { AttendanceRecord } from "@/types";

export type TodayAttendanceRow = {
  employeeId: string;
  recordId: string | null;
  employeeName: string;
  department: string;
  shift: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
};

export type PaginatedAttendance = {
  data: AttendanceRecord[];
  total: number;
};

export type AttendanceQueryParams = {
  employeeId?: string;
  from?: string;
  to?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const attendanceService = {
  async getToday() {
    const { data } = await api.get<TodayAttendanceRow[]>("/attendance/today");
    return data;
  },

  async getAttendance(params: AttendanceQueryParams) {
    const { data } = await api.get<PaginatedAttendance>("/attendance", {
      params,
    });
    return data;
  },

  async getEmployeeAttendance(employeeId: string, page = 1, limit = 10) {
    const { data } = await api.get<PaginatedAttendance>("/attendance", {
      params: { employeeId, page, limit },
    });
    return data;
  },

  async update(id: string, updateData: { checkIn?: string; checkOut?: string; status?: string }) {
    const { data } = await api.patch<AttendanceRecord>(`/attendance/${id}`, updateData);
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

  async getTrend(days = 7) {
    const { data } = await api.get<{ date: string; day: string; present: number; late: number; absent: number }[]>("/attendance/trend", {
      params: { days },
    });
    return data;
  },

  async getDepartmentStats() {
    const { data } = await api.get<{ department: string; employees: number; present: number; rate: number }[]>("/attendance/department-stats");
    return data;
  },
};
