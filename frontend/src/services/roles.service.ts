import { api } from "@/lib/axios";
import type { Role } from "@/types";

export type CreateRoleDto = {
  name: string;
};

export const rolesService = {
  async getAll() {
    const { data } = await api.get<Role[]>("/roles");
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  },
  async create(dto: CreateRoleDto) {
    const { data } = await api.post<Role>("/roles", dto);
    return data;
  },
  async update(id: string, dto: CreateRoleDto) {
    const { data } = await api.patch<Role>(`/roles/${id}`, dto);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/roles/${id}`);
    return data;
  },
};
