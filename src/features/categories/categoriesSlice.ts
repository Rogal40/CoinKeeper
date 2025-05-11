import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/category";
import * as api from "../../api/categories";

// Async thunks
export const loadCategories = createAsyncThunk<Category[]>(
  "categories/loadAll",
  async () => {
    return await api.fetchCategories();
  }
);

export const addCategory = createAsyncThunk<
  Category,
  { name: string; color?: string }
>("categories/addOne", async (payload) => {
  return await api.createCategory(payload);
});

export const updateCategoryThunk = createAsyncThunk<
  void,
  { id: string; updates: Partial<Omit<Category, "id" | "userId">> }
>("categories/updateOne", async ({ id, updates }) => {
  await api.updateCategory(id, updates);
});

export const deleteCategoryThunk = createAsyncThunk<string, string>(
  "categories/deleteOne",
  async (id) => {
    await api.deleteCategory(id);
    return id;
  }
);

// Slice
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
  reducers: {
    /* no sync reducers */
  },
  extraReducers: (builder) => {
    builder
      // load all
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

      // add
      .addCase(addCategory.fulfilled, (s, a: PayloadAction<Category>) => {
        s.items.push(a.payload);
      })

      // update
      .addCase(updateCategoryThunk.fulfilled, (s, a) => {
        // no payload, we could re-fetch or optimistically update
      })

      // delete
      .addCase(deleteCategoryThunk.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((c) => c.id !== a.payload);
      });
  },
});

export default categoriesSlice.reducer;
