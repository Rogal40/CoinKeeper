import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../api/categories";
import type { Category } from "../../types/category";

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks
export const loadCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/loadAll", async (_, { rejectWithValue }) => {
  try {
    return await api.fetchCategories();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addCategory = createAsyncThunk<
  Category,
  Omit<Category, "id" | "userId">,
  { rejectValue: string }
>("categories/add", async (data, { rejectWithValue }) => {
  try {
    return await api.createCategory(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateCategoryThunk = createAsyncThunk<
  Category,
  { id: string; updates: Partial<Omit<Category, "id" | "userId">> },
  { rejectValue: string }
>("categories/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await api.updateCategory(id, updates);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteCategoryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("categories/delete", async (id, { rejectWithValue }) => {
  try {
    await api.deleteCategory(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to load";
      })
      // add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Add failed";
      })
      // update
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Update failed";
      })
      // delete
      .addCase(
        deleteCategoryThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((c) => c.id !== action.payload);
        }
      )
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Delete failed";
      });
  },
});

export default categoriesSlice.reducer;
