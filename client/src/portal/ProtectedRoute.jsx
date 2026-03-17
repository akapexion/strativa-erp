import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userLogged, allowedRoles, children }) => {
  if (!userLogged) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userLogged.user_role)) {
    // Role not allowed
    return <Navigate to="/login" replace />;
  }

  // User is allowed
  return children;
};

export default ProtectedRoute;