import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token'); // Verifica si existe un token
    return !!token; // Devuelve true si el token existe
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
