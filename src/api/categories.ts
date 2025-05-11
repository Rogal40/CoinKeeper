import axios from "./axios";
import type { Category } from "../types/category";

/**
 * Fetch all categories for the current user.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get("/categories");
  return response.data;
};

/**
 * Create a new category.
 */
export const createCategory = async (
  data: Omit<Category, "id" | "userId">
): Promise<Category> => {
  const response = await axios.post("/categories", data);
  return response.data;
};

/**
 * Update a category by ID.
 */
export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, "id" | "userId">>
): Promise<Category> => {
  const response = await axios.patch(`/categories/${id}`, updates);
  return response.data;
};

/**
 * Delete a category by ID.
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`/categories/${id}`);
};
