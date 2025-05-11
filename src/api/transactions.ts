import axios from "./axios";
import type { Transaction } from "../types/transaction";

/**
 * Fetch all transactions for the current user.
 * Requires Firebase ID token to be set on axios default headers.
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get("/transactions");
  return response.data;
};

/**
 * Create a new transaction.
 */
export const createTransaction = async (
  data: Omit<Transaction, "id" | "userId">
): Promise<Transaction> => {
  const response = await axios.post("/transactions", data);
  return response.data;
};

/**
 * Update an existing transaction by ID.
 */
export const updateTransaction = async (
  id: string,
  updates: Partial<Omit<Transaction, "id" | "userId">>
): Promise<Transaction> => {
  const response = await axios.patch(`/transactions/${id}`, updates);
  return response.data;
};

/**
 * Delete a transaction by ID.
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await axios.delete(`/transactions/${id}`);
};
