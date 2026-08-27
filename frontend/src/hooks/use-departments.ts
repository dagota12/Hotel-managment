import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentsService, type CreateDepartmentDto } from "@/services/departments.service";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentsService.getAll,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateDepartmentDto }) =>
      departmentsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
