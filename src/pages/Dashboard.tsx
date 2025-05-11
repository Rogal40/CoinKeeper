import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <p>
          Logged in as <strong>{user.email}</strong>
        </p>
      )}
      <button onClick={handleLogout}>Logout</button>

      <AddTransactionForm />
      <TransactionList />
    </div>
  );
}
