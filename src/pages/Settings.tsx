import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadCategories,
  addCategory,
  deleteCategoryThunk,
} from "../features/categories/categoriesSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Settings() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      dispatch(loadCategories(user.uid));
    }
  }, [user, loading, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

   await dispatch(addCategory({ name: name.trim(), color, userId: user.uid }));

    setName("");
    setColor("#000000");
  };

  return (
    <div>
      <h2>Category Settings</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <span style={{ color: cat.color }}>{cat.name}</span>
            <button onClick={() => dispatch(deleteCategoryThunk(cat.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
