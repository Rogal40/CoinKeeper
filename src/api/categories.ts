import api from "./axios";
import type { Category } from "../types/category";

export async function fetchCategories(uid: string): Promise<Category[]> {
  const res = await api.get<Category[]>(`/categories?userId=${uid}`);
  return res.data;
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const res = await api.post<Category>("/categories", data);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
