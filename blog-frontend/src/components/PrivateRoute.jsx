import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; 

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default PrivateRoute;