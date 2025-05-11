import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/category";
import * as api from "../../api/categories";

export const loadCategories = createAsyncThunk<Category[], string>(
  "categories/loadAll",
  async (uid) => {
    return await api.fetchCategories(uid);
  }
);

export const addCategory = createAsyncThunk<Category, Omit<Category, "id">>(
  "categories/addOne",
  async (payload) => await api.createCategory(payload)
);

export const deleteCategoryThunk = createAsyncThunk<string, string>(
  "categories/deleteOne",
  async (id) => {
    await api.deleteCategory(id);
    return id;
  }
);

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadCategories.fulfilled, (s, a: PayloadAction<Category[]>) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(loadCategories.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load categories";
      })
      .addCase(addCategory.fulfilled, (s, a: PayloadAction<Category>) => {
        s.items.push(a.payload);
      })
      .addCase(deleteCategoryThunk.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((c) => c.id !== a.payload);
      });
  },
});

export default categoriesSlice.reducer;
