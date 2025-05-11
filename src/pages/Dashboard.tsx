import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadTransactions } from "../features/transactions/transactionsSlice";
import { loadCategories } from "../features/categories/categoriesSlice";
import { useEffect } from "react";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);

  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

useEffect(() => {
  if (user) {
    dispatch(loadTransactions(user.uid));
    dispatch(loadCategories(user.uid));
  }
}, [user, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Logged in as <b>{user?.email}</b>
      </p>

      <button onClick={() => auth.signOut()} className="mb-4">
        Logout
      </button>

      <div className="mb-4">
        <Link to="/settings" className="underline text-blue-600">
          ⚙️ Go to Settings
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-2">💰 Balance: {balance} ₸</h2>

      <AddTransactionForm />
      <TransactionList />
    </div>
  );
}
