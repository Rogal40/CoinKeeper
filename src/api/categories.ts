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
import type { Category } from "../types/category";

const db = getFirestore();

function requireAuthUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be logged in");
  return user.uid;
}

/** Fetch categories for current user */
export async function fetchCategories(): Promise<Category[]> {
  const uid = requireAuthUid();
  const q = query(
    collection(db, "categories"),
    where("userId", "==", uid),
    orderBy("name")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Category, "id">),
  }));
}

/** Create a new category */
export async function createCategory(
  data: Omit<Category, "id" | "userId">
): Promise<Category> {
  const uid = requireAuthUid();
  const docRef = await addDoc(collection(db, "categories"), {
    ...data,
    userId: uid,
  });
  return { id: docRef.id, ...data, userId: uid };
}

/** Update category */
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, "id" | "userId">>
): Promise<void> {
  const uid = requireAuthUid();
  const cDoc = doc(db, "categories", id);
  await updateDoc(cDoc, updates);
}

/** Delete category */
export async function deleteCategory(id: string): Promise<void> {
  const uid = requireAuthUid();
  const cDoc = doc(db, "categories", id);
  await deleteDoc(cDoc);
}
