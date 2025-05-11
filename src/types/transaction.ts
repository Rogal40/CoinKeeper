// src/types/transaction.ts
export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  date: string; // ISO date string
  description?: string;
}
