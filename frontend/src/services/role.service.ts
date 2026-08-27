import { api } from "@/lib/axios";
import type { Role } from "@/types";

export async function getRoles() {
  const { data } = await api.get<Role[]>("/roles");
  return data;
}
