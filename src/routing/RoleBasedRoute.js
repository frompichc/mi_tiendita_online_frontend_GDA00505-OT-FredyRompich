import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/" />; // Redirige al login si no está autenticado
  }

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/unauthorized" />; // Redirige si no tiene el rol adecuado
  }

  return <Outlet />; // Renderiza las rutas protegidas
};

export default RoleBasedRoute;