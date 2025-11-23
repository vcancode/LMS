import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // If no token found, redirect to signup
  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  // Otherwise, allow access
  return element;
};

export default ProtectedRoute;
