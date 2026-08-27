import { api } from "@/lib/axios";
import type { AttendanceRecord } from "@/types";

export async function getAttendanceRecords() {
  const { data } = await api.get<AttendanceRecord[]>("/attendance");
  return data;
}

export async function getTodayAttendance() {
  const { data } = await api.get("/attendance/today");
  return data;
}