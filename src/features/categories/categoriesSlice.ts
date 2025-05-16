import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as api from "../../api/categories";
import type { Category } from "../../types/category";
import { auth } from "../../firebase";

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

export const loadCategories = createAsyncThunk<Category[]>(
  "categories/loadAll",
  async (_, thunkAPI) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return await api.fetchCategories(user.uid);
  }
);

export const addCategory = createAsyncThunk<
  Category,
  Omit<Category, "id" | "userId">
>("categories/addOne", async (payload, thunkAPI) => {
  const user = auth.currentUser!;
  return await api.createCategory({ ...payload, userId: user.uid });
});

export const deleteCategoryThunk = createAsyncThunk<string, string>(
  "categories/deleteOne",
  async (id) => {
    await api.deleteCategory(id);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
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
        state.error = action.error.message ?? "Failed to load categories";
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        deleteCategoryThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((c) => c.id !== action.payload);
        }
      );
  },
});

export default categoriesSlice.reducer;
