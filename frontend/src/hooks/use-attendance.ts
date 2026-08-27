import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";

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

export function useEmployeeAttendance(employeeId: string) {
  return useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => attendanceService.getEmployeeAttendance(employeeId),
    enabled: !!employeeId,
  });
}
