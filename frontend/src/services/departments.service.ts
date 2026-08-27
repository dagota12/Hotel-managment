import { api } from "@/lib/axios";
import type { Department } from "@/types";

export type CreateDepartmentDto = {
  name: string;
};

export const departmentsService = {
  async getAll() {
    const { data } = await api.get<Department[]>("/departments");
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<Department>(`/departments/${id}`);
    return data;
  },
  async create(dto: CreateDepartmentDto) {
    const { data } = await api.post<Department>("/departments", dto);
    return data;
  },
  async update(id: string, dto: CreateDepartmentDto) {
    const { data } = await api.patch<Department>(`/departments/${id}`, dto);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/departments/${id}`);
    return data;
  },
};
