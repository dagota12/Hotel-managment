import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import type { AttendanceQueryParams } from "@/services/attendance.service";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: attendanceService.getToday,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => attendanceService.checkIn(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => attendanceService.checkOut(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
  });
}

export function useEmployeeAttendance(employeeId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["attendance", employeeId, page, limit],
    queryFn: () => attendanceService.getEmployeeAttendance(employeeId, page, limit),
    enabled: !!employeeId,
  });
}

export function useAttendanceReport(params: AttendanceQueryParams) {
  return useQuery({
    queryKey: ["attendance", "report", params],
    queryFn: () => attendanceService.getAttendance(params),
    enabled: !!(params.from && params.to),
  });
}

export function useAttendanceTrend(days = 7) {
  return useQuery({
    queryKey: ["attendance", "trend", days],
    queryFn: () => attendanceService.getTrend(days),
  });
}

export function useDepartmentStats() {
  return useQuery({
    queryKey: ["attendance", "department-stats"],
    queryFn: () => attendanceService.getDepartmentStats(),
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { checkIn?: string; checkOut?: string; status?: string } }) =>
      attendanceService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
