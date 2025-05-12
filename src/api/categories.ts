// src/api/categories.ts
import api from "./axios";
import { auth } from "../firebase";
import type { Category } from "../types/category";

function requireAuthUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.uid;
}

/** Fetch only this user’s categories */
export async function fetchCategories(): Promise<Category[]> {
  const uid = requireAuthUid();
  const res = await api.get<Category[]>(`/categories?userId=${uid}`);
  return res.data;
}

/** Create a new category tied to the current user */
export async function createCategory(
  data: Omit<Category, "id" | "userId">
): Promise<Category> {
  const uid = requireAuthUid();
  const res = await api.post<Category>("/categories", {
    ...data,
    userId: uid,
  });
  return res.data;
}

/** Delete by id (json-server will remove it) */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
