import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "../../types/transaction";
import * as api from "../../api/transactions";

export const loadTransactions = createAsyncThunk<Transaction[], string>(
  "transactions/loadAll",
  async (uid) => await api.fetchTransactions(uid)
);

export const addTransaction = createAsyncThunk<Transaction, Omit<Transaction, "id">>(
  "transactions/addOne",
  async (payload) => await api.createTransaction(payload)
);

export const deleteTransactionThunk = createAsyncThunk<string, string>(
  "transactions/deleteOne",
  async (id) => {
    await api.deleteTransaction(id);
    return id;
  }
);

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadTransactions.fulfilled, (s, a: PayloadAction<Transaction[]>) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(loadTransactions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load transactions";
      })
      .addCase(addTransaction.fulfilled, (s, a: PayloadAction<Transaction>) => {
        s.items.unshift(a.payload);
      })
      .addCase(deleteTransactionThunk.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((t) => t.id !== a.payload);
      });
  },
});

export default transactionsSlice.reducer;
