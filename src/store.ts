import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./features/categories/categoriesSlice";
import transactionsReducer from "./features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
