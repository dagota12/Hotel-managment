import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shiftsService, type CreateShiftDto } from "@/services/shifts.service";

export function useShifts() {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: shiftsService.getAll,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shiftsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateShiftDto }) =>
      shiftsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shiftsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}
