import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadTransactions } from "../features/transactions/transactionsSlice";
import { loadCategories } from "../features/categories/categoriesSlice";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const transactions = useAppSelector((state) => state.transactions.items);

  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  useEffect(() => {
    if (user) {
      dispatch(loadTransactions());
      dispatch(loadCategories());
    }
  }, [user, dispatch]);

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.user}>
          Logged in as <strong>{user?.email}</strong>
        </div>
        <div className={styles.buttons}>
          <button onClick={() => auth.signOut()}>Logout</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button onClick={() => navigate("/stats")}>Stats</button>
        </div>
      </header>
      <h2 className={styles.balance}>Balance: {balance} ₸</h2>
      <section className={styles.section}>
        <AddTransactionForm />
      </section>
      <section className={styles.section}>
        <TransactionList />
      </section>
    </div>
  );
}
