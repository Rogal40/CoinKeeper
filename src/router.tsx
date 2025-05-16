import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "stats",
        element: (
          <PrivateRoute>
            <Stats />
          </PrivateRoute>
        ),
      },

      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },

  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },

  { path: "*", element: <Navigate to="/" replace /> },
]);
