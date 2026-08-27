"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAttendanceSummary,
  getDepartmentSummary,
} from "@/services/report.service";

export function useAttendanceSummary(from: string, to: string) {
  return useQuery({
    queryKey: ["reports", "attendance", from, to],
    queryFn: () => getAttendanceSummary(from, to),
  });
}

export function useDepartmentSummary(from: string, to: string) {
  return useQuery({
    queryKey: ["reports", "department", from, to],
    queryFn: () => getDepartmentSummary(from, to),
  });
}
