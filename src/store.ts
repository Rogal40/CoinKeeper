import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./features/categories/categoriesSlice";
import transactionsReducer from "./features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    transactions: transactionsReducer,
    // …other slices (auth, ui, etc.)
  },
  // (optionally) add thunk middleware, serializable checks, devTools, etc.
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
