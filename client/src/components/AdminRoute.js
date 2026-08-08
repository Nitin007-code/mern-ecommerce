import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// UI guard only: server routes still enforce adminOnly for real security.
export default function AdminRoute({ children }) {
  const { user } = useAuth(); const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
