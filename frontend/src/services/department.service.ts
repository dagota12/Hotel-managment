import { api } from "@/lib/axios";
import type { Department } from "@/types";

export async function getDepartments() {
  const { data } = await api.get<Department[]>("/departments");
  return data;
}
