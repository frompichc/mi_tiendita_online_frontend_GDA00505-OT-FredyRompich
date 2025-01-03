import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from './components/UI/NavigationBar/NavigationBar';

import Login from './components/Pages/Login';
import NotFound from './components/Pages/NotFound';
import TiendaOnline from './components/Pages/TiendaOnline';
import Carrito from './components/Pages/Carrito';

import ProductosList from './components/Lists/ProductosList';
import RolesList from './components/Lists/RolesList';
import UsuariosList from './components/Lists/UsuariosList';
import EstadosList from './components/Lists/EstadosList';
import CategoriaProductosList from './components/Lists/CategoriaProductosList';
import OrdenesList from './components/Lists/OrdenesList';
import OrdenDetallesList from './components/Lists/OrdenDetallesList';
import ClientesList from './components/Lists/ClientesList';

import IngresarProducto from './components/Forms/IngresarProducto';
import ModificarProducto from './components/Forms/ModificarProducto';
import IngresarRol from './components/Forms/IngresarRol';
import ModificarRol from './components/Forms/ModificarRol';
import IngresarEstado from './components/Forms/IngresarEstado';
import ModificarEstado from './components/Forms/ModificarEstado';
import IngresarCategoriaProducto from './components/Forms/IngresarCategoriaProducto';
import ModificarCategoriaProducto from './components/Forms/ModificarCategoriaProducto';
import IngresarUsuario from './components/Forms/IngresarUsuario';
import ModificarUsuario from './components/Forms/ModificarUsuario';
import ReiniciarContrasena from './components/Forms/ReiniciarContrasena';
import IngresarCliente from './components/Forms/IngresarCliente';
import ModificarCliente from './components/Forms/ModificarCliente';


import ProtectedRoute from './routing/ProtectedRoute';

import { CartProvider } from './context/CartContext';

function AppLayout() {
  const location = useLocation();
  const rol = localStorage.getItem('rol'); 
  return (
    <>
      {location.pathname !== '/' && <NavigationBar />}
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} /> 

        {/* Rutas protegidas */}
        
        <Route path="/*" element={<ProtectedRoute />}>
          {rol === 'Cliente' && (
            <>
              <Route path="tiendaonline" element={<TiendaOnline />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="ordenes" element={<OrdenesList />} />
              <Route path="ordendetalles/:id" element={<OrdenDetallesList />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
          {rol === 'Operador' && (
            <>
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/ingresar" element={<IngresarProducto />} />
              <Route path="productos/modificar/:id" element={<ModificarProducto />} />
              <Route path="roles" element={<RolesList />} />
              <Route path="roles/ingresar" element={<IngresarRol />} />
              <Route path="roles/modificar/:id" element={<ModificarRol />} />
              <Route path="estados" element={<EstadosList />} />
              <Route path="estados/ingresar" element={<IngresarEstado />} />
              <Route path="estados/modificar/:id" element={<ModificarEstado />} />
              <Route path="categorias" element={<CategoriaProductosList />} />
              <Route path="categorias/ingresar" element={<IngresarCategoriaProducto />} />
              <Route path="categorias/modificar/:id" element={<ModificarCategoriaProducto />} />
              <Route path="usuarios" element={<UsuariosList />} />
              <Route path="usuarios/ingresar" element={<IngresarUsuario />} />
              <Route path="usuarios/modificar/:id" element={<ModificarUsuario />} />
              <Route path="usuarios/reiniciar/:id" element={<ReiniciarContrasena />} />
              <Route path="ordenes" element={<OrdenesList />} />
              <Route path="ordendetalles/:id" element={<OrdenDetallesList />} />
              <Route path="clientes" element={<ClientesList />} />
              <Route path="clientes/ingresar" element={<IngresarCliente />} />
              <Route path="clientes/modificar/:id" element={<ModificarCliente />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Route>
      </Routes>
      </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}

