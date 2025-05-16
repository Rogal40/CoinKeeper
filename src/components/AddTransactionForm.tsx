import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadCategories } from "../features/categories/categoriesSlice";
import { addTransactionThunk } from "../features/transactions/transactionsSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function AddTransactionForm() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const [user, loading] = useAuthState(auth);

  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(loadCategories());
    }
  }, [user, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !date || !amount || !user) return;

    await dispatch(
      addTransactionThunk({ type, amount, categoryId, date, description })
    );

    setAmount(0);
    setCategoryId("");
    setDate("");
    setDescription("");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <h2 className="text-xl font-bold">Add Transaction</h2>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
        required
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
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
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}
