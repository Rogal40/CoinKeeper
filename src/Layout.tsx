import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="p-6">
      <Outlet />
    </div>
  );
}
