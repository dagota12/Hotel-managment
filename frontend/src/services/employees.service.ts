import { api } from "@/lib/axios";
import type { Employee } from "@/types";

export type CreateEmployeeDto = {
  fullName: string;
  email: string;
  phone?: string;
  departmentId: string;
  roleId: string;
  shiftId: string;
};

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

export const employeesService = {
  async getAll() {
    const { data } = await api.get<Employee[]>("/employees");
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },

  async create(dto: CreateEmployeeDto) {
    const { data } = await api.post<Employee>("/employees", dto);
    return data;
  },

  async update(id: string, dto: UpdateEmployeeDto) {
    const { data } = await api.patch<Employee>(`/employees/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/employees/${id}`);
    return data;
  },
};

