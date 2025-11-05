import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isActive } = useAuth();

  return isActive ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
