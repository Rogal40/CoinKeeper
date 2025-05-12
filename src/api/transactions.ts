// src/api/transactions.ts
import api from "./axios";
import { auth } from "../firebase";
import type { Transaction } from "../types/transaction";

function requireAuthUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.uid;
}

/** Fetch only this user’s transactions, newest first */
export async function fetchTransactions(): Promise<Transaction[]> {
  const uid = requireAuthUid();
  // sort by date descending
  const res = await api.get<Transaction[]>(
    `/transactions?userId=${uid}&_sort=date&_order=desc`
  );
  return res.data;
}

/** Add a new transaction record */
export async function createTransaction(
  data: Omit<Transaction, "id" | "userId">
): Promise<Transaction> {
  const uid = requireAuthUid();
  const res = await api.post<Transaction>("/transactions", {
    ...data,
    userId: uid,
  });
  return res.data;
}

/** Remove a transaction */
export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
