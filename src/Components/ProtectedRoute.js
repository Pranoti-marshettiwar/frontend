import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    // Not logged in -> redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Role not authorized -> redirect to default product dashboard
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;