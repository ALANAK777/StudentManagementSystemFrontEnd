import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user?.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
