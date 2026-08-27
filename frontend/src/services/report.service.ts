import { api } from "@/lib/axios";
import type { AttendanceSummaryRow, DepartmentSummaryRow } from "@/types";

export async function getAttendanceSummary(from: string, to: string) {
  const { data } = await api.get<AttendanceSummaryRow[]>(
    "/reports/attendance",
    {
      params: { from, to },
    },
  );
  return data;
}

export async function getDepartmentSummary(from: string, to: string) {
  const { data } = await api.get<DepartmentSummaryRow[]>(
    "/reports/department-attendance",
    {
      params: { from, to },
    },
  );
  return data;
}
