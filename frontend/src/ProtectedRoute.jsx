import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  // Fallback to localStorage for compatibility
  const token = auth?.accessToken || localStorage.getItem("accessToken");

  // If user is trying to access /login, allow it (public)
  if (location.pathname === "/login") return children;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
