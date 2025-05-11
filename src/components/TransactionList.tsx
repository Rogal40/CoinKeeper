import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteTransactionThunk,
  editTransactionThunk,
} from "../features/transactions/transactionsSlice";

export default function TransactionList() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);

  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  const handleUpdate = () => {
    if (!editId || !editCategory || !editDate) return;

    dispatch(
      editTransactionThunk({
        id: editId,
        updates: {
          amount: editAmount,
          categoryId: editCategory,
          date: editDate,
          description: editDescription,
        },
      })
    );

    // Сброс полей
    setEditId(null);
    setEditAmount(0);
    setEditCategory("");
    setEditDate("");
    setEditDescription("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Transactions</h2>
      <ul>
        {transactions.map((t) => {
          const category = categories.find((c) => c.id === t.categoryId);
          const isEditing = t.id === editId;

          return (
            <li key={t.id} className="mb-2">
              <strong>{t.type}</strong> — {t.amount} ₸ — {category?.name} — {t.date}
              <button onClick={() => dispatch(deleteTransactionThunk(t.id))}>Delete</button>
              <button
                onClick={() => {
                  setEditId(t.id);
                  setEditAmount(t.amount);
                  setEditCategory(t.categoryId);
                  setEditDate(t.date);
                  setEditDescription(t.description || "");
                }}
              >
                Edit
              </button>

              {isEditing && (
                <div className="mt-2">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
