import { api } from "@/lib/axios";
import type { Shift } from "@/types";

export type CreateShiftDto = {
  name: string;
  startTime: string;
  endTime: string;
};

export const shiftsService = {
  async getAll() {
    const { data } = await api.get<Shift[]>("/shifts");
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<Shift>(`/shifts/${id}`);
    return data;
  },
  async create(dto: CreateShiftDto) {
    const { data } = await api.post<Shift>("/shifts", dto);
    return data;
  },
  async update(id: string, dto: CreateShiftDto) {
    const { data } = await api.patch<Shift>(`/shifts/${id}`, dto);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/shifts/${id}`);
    return data;
  },
};
