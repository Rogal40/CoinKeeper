import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as api from "../../api/transactions";
import type { Transaction } from "../../types/transaction";

export const loadTransactions = createAsyncThunk<Transaction[], string>(
  "transactions/loadAll",
  api.fetchTransactions
);

export const addTransactionThunk = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "userId">
>("transactions/addOne", api.createTransaction);

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
      .addCase(
        addTransactionThunk.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          // prepend new transaction so latest appear first
          state.items.unshift(action.payload);
        }
      )
      .addCase(
        deleteTransactionThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((t) => t.id !== action.payload);
        }
      );
  },
});

export default transactionsSlice.reducer;
