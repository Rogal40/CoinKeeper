import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "../../types/transaction";
import * as api from "../../api/transactions";

// Async thunks
export const loadTransactions = createAsyncThunk<Transaction[]>(
  "transactions/loadAll",
  async () => {
    return await api.fetchTransactions();
  }
);

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "userId">
>("transactions/addOne", async (payload) => {
  return await api.createTransaction(payload);
});

export const updateTransactionThunk = createAsyncThunk<
  void,
  { id: string; updates: Partial<Omit<Transaction, "id" | "userId">> }
>("transactions/updateOne", async ({ id, updates }) => {
  await api.updateTransaction(id, updates);
});

export const deleteTransactionThunk = createAsyncThunk<string, string>(
  "transactions/deleteOne",
  async (id) => {
    await api.deleteTransaction(id);
    return id;
  }
);

// Slice
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

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Here you could add synchronous helpers if needed
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadTransactions.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(
        loadTransactions.fulfilled,
        (s, a: PayloadAction<Transaction[]>) => {
          s.items = a.payload;
          s.loading = false;
        }
      )
      .addCase(loadTransactions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load transactions";
      })

      // add
      .addCase(addTransaction.fulfilled, (s, a: PayloadAction<Transaction>) => {
        // newest on top
        s.items.unshift(a.payload);
      })

      // update (no payload, server‐side persisted)
      .addCase(updateTransactionThunk.fulfilled, (s) => {
        // could re-fetch or merge optimistic updates
      })

      // delete
      .addCase(
        deleteTransactionThunk.fulfilled,
        (s, a: PayloadAction<string>) => {
          s.items = s.items.filter((t) => t.id !== a.payload);
        }
      );
  },
});

export default transactionsSlice.reducer;
