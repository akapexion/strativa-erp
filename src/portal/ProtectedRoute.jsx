import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userLogged, allowedRoles, children }) => {
  if (!userLogged) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  const isHRHead = userLogged.user_designation === "HR Head";

  if (allowedRoles) {
    const hasRole = allowedRoles.includes(userLogged.user_role);
    const isAllowedAdmin = allowedRoles.includes("admin") && isHRHead;

    if (!hasRole && !isAllowedAdmin) {
      // Role not allowed and not HR Head accessing admin routes
      return <Navigate to="/login" replace />;
    }
  }

  // User is allowed
  return children;
};

export default ProtectedRoute;