import { useEffect } from "react";
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
  const { items: categories, loading: catLoading } = useAppSelector(
    (s) => s.categories
  );
  const { items: transactions, loading: txLoading } = useAppSelector(
    (s) => s.transactions
  );

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadTransactions());
  }, [dispatch]);

  if (catLoading || txLoading) return <div>Loading…</div>;

  const expenseByCatMap = transactions.reduce<Record<string, number>>(
    (map, tx) => {
      if (tx.type === "expense") {
        const amt = Math.abs(tx.amount);
        map[tx.categoryId] = (map[tx.categoryId] || 0) + amt;
      }
      return map;
    },
    {}
  );

  const expenseByCat = categories
    .map((cat) => ({
      name: cat.name,
      value: expenseByCatMap[cat.id] || 0,
    }))
    .filter((d) => d.value > 0);

  const expenseByMonthMap = transactions.reduce<Record<string, number>>(
    (map, tx) => {
      if (tx.type === "expense") {
        const amt = Math.abs(tx.amount);
        const month = tx.date.slice(0, 7);
        map[month] = (map[month] || 0) + amt;
      }
      return map;
    },
    {}
  );

  const barData = Object.entries(expenseByMonthMap)
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
