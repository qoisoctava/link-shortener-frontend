import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth";
import { ROUTES } from "../../utils/constants";

function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

export default PrivateRoute;
