import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  if (user) {
    const dashboard = 
      user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD :
      user.role === 'doctor' ? ROUTES.DOCTOR.DASHBOARD :
      ROUTES.PATIENT.DASHBOARD;
      
    return <Navigate to={dashboard} replace />;
  }

  return children;
};

export default PublicRoute;
