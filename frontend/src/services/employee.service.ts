import { api } from "@/lib/axios";
import type { Employee } from "@/types";

export async function getEmployees() {
  const { data } = await api.get<Employee[]>("/employees");
  return data;
}