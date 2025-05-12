import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadCategories } from "../features/categories/categoriesSlice";
import { loadTransactions } from "../features/transactions/transactionsSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Stats() {
  const dispatch = useAppDispatch();
  const [user, loadingAuth] = useAuthState(auth);

  const { items: categories } = useAppSelector((s) => s.categories);
  const { items: transactions, loading: txLoading } = useAppSelector(
    (s) => s.transactions
  );

  // load data once we know the uid
  useEffect(() => {
    if (user) {
      dispatch(loadCategories(user.uid));
      dispatch(loadTransactions(user.uid));
    }
  }, [dispatch, user]);

  if (loadingAuth || txLoading) {
    return <div>Loading…</div>;
  }

  // group totals by category
  const expenseByCat = categories
    .map((cat) => {
      const total = transactions
        .filter((t) => t.categoryId === cat.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value: total };
    })
    .filter((d) => d.value > 0);

  // prepare bar chart: total per month
  const totalsByMonth: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const m = t.date.slice(0, 7); // "YYYY-MM"
      totalsByMonth[m] = (totalsByMonth[m] || 0) + t.amount;
    });
  const barData = Object.entries(totalsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));

  return (
    <div style={{ padding: 16 }}>
      <h1>Statistics</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Expenses by Category</h2>
        {expenseByCat.length === 0 ? (
          <p>No expense data yet.</p>
        ) : (
          <PieChart width={400} height={300}>
            <Pie
              data={expenseByCat}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {expenseByCat.map((_, i) => (
                <Cell key={i} fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <h2>Monthly Expenses</h2>
        {barData.length === 0 ? (
          <p>No expense data yet.</p>
        ) : (
          <BarChart width={600} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" name="Expenses" />
          </BarChart>
        )}
      </section>
    </div>
  );
}
