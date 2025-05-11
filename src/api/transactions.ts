import api from "./axios";
import type { Transaction } from "../types/transaction";

export async function fetchTransactions(uid: string): Promise<Transaction[]> {
  const res = await api.get<Transaction[]>(`/transactions?userId=${uid}&_sort=date&_order=desc`);
  return res.data;
}

export async function createTransaction(data: Omit<Transaction, "id">): Promise<Transaction> {
  const res = await api.post<Transaction>("/transactions", data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
