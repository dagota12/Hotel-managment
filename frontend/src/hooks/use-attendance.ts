"use client";

import { useQuery } from "@tanstack/react-query";
import { getAttendanceRecords, getTodayAttendance } from "@/services/attendance.service";

export function useAttendanceRecords() {
  return useQuery({ queryKey: ["attendance"], queryFn: getAttendanceRecords });
}

export function useTodayAttendance() {
  return useQuery({ queryKey: ["attendance", "today"], queryFn: getTodayAttendance });
}