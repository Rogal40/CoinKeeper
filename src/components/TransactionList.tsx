import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadTransactions, deleteTransactionThunk } from "../features/transactions/transactionsSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function TransactionList() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) dispatch(loadTransactions(user.uid));
  }, [dispatch, user]);

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            <strong>{t.type}</strong> — {t.amount} — {t.date}
            <button onClick={() => dispatch(deleteTransactionThunk(t.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
