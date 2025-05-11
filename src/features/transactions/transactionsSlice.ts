import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../api/transactions";
import type { Transaction } from "../../types/transaction";

export interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks
export const loadTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>("transactions/loadAll", async (_, { rejectWithValue }) => {
  try {
    return await api.fetchTransactions();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "userId">,
  { rejectValue: string }
>("transactions/add", async (data, { rejectWithValue }) => {
  try {
    return await api.createTransaction(data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateTransactionThunk = createAsyncThunk<
  Transaction,
  { id: string; updates: Partial<Omit<Transaction, "id" | "userId">> },
  { rejectValue: string }
>("transactions/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await api.updateTransaction(id, updates);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteTransactionThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("transactions/delete", async (id, { rejectWithValue }) => {
  try {
    await api.deleteTransaction(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load
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
        state.error =
          action.payload || action.error.message || "Failed to load";
      })
      // add
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Add failed";
      })
      // update
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Update failed";
      })
      // delete
      .addCase(
        deleteTransactionThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((t) => t.id !== action.payload);
        }
      )
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Delete failed";
      });
  },
});

export default transactionsSlice.reducer;
