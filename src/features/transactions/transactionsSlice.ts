import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as api from "../../api/transactions";
import type { Transaction } from "../../types/transaction";
import { auth } from "../../firebase";

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

export const loadTransactions = createAsyncThunk<Transaction[]>(
  "transactions/loadAll",
  async (_, thunkAPI) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return api.fetchTransactions(user.uid);
  }
);

export const addTransactionThunk = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "userId">
>("transactions/addOne", async (payload, thunkAPI) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return api.createTransaction({ ...payload, userId: user.uid });
});

export const deleteTransactionThunk = createAsyncThunk<string, string>(
  "transactions/deleteOne",
  async (id) => {
    await api.deleteTransaction(id);
    return id;
  }
);

export const editTransactionThunk = createAsyncThunk<
  { id: string; updates: Partial<Omit<Transaction, "id" | "userId">> },
  { id: string; updates: Partial<Omit<Transaction, "id" | "userId">> }
>("transactions/editOne", async ({ id, updates }) => {
  await api.updateTransaction(id, updates);
  return { id, updates };
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load transactions";
      })
      .addCase(addTransactionThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTransactionThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload.updates };
        }
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;
