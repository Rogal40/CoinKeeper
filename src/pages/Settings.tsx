import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadCategories,
  addCategory,
  deleteCategoryThunk,
} from "../features/categories/categoriesSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector((state) => state.categories.items);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) dispatch(loadCategories());
  }, [user, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(addCategory({ name: name.trim(), color }));
    setName("");
  };

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.container}>
      <h1>Categories</h1>
      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul className={styles.list}>
        {categories.map((c) => (
          <li key={c.id} className={styles.item}>
            <span style={{ color: c.color }}>{c.name}</span>
            <button onClick={() => dispatch(deleteCategoryThunk(c.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
