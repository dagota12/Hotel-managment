import { api } from "@/lib/axios";
import type { Shift } from "@/types";

export async function getShifts() {
  const { data } = await api.get<Shift[]>("/shifts");
  return data;
}