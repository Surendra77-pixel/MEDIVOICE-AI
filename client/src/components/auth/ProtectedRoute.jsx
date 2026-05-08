import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access another role's route
    const dashboard = 
      user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD :
      user.role === 'doctor' ? ROUTES.DOCTOR.DASHBOARD :
      ROUTES.PATIENT.DASHBOARD;
      
    return <Navigate to={dashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
