import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesService, type CreateRoleDto } from "@/services/roles.service";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: rolesService.getAll,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateRoleDto }) =>
      rolesService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
