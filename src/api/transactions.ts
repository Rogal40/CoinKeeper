import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth } from "../firebase";
import type { Transaction } from "../types/transaction";

const db = getFirestore();

function requireAuthUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be logged in");
  return user.uid;
}

/** Fetch all transactions for the current user, ordered by date desc */
export async function fetchTransactions(): Promise<Transaction[]> {
  const uid = requireAuthUid();
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", uid),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Transaction, "id">),
  }));
}

/** Create a new transaction under the current user */
export async function createTransaction(
  data: Omit<Transaction, "id" | "userId">
): Promise<Transaction> {
  const uid = requireAuthUid();
  const docRef = await addDoc(collection(db, "transactions"), {
    ...data,
    userId: uid,
    createdAt: Date.now(),
  });
  return { id: docRef.id, ...data, userId: uid };
}

/** Update an existing transaction (only your own) */
export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, "id" | "userId">>
): Promise<void> {
  const uid = requireAuthUid();
  const tDoc = doc(db, "transactions", id);
  // optionally: you could read tDoc.data().userId and check matches uid
  await updateDoc(tDoc, updates);
}

/** Delete a transaction by ID */
export async function deleteTransaction(id: string): Promise<void> {
  const uid = requireAuthUid();
  const tDoc = doc(db, "transactions", id);
  // again, you could verify owner if you like
  await deleteDoc(tDoc);
}
