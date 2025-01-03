import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';

// Componente reutilizable para un botón de navegación
const NavButton = ({ label, path, icon, onClick, tooltip }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta la función personalizada, si existe
    } else if (path) {
      navigate(path); // Navega a la ruta especificada
    }
  };

  return icon ? (
    <Tooltip title={tooltip} arrow>
      <IconButton color="inherit" onClick={handleClick}>
        {icon}
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title={tooltip} arrow>
    
      <Button color="inherit" onClick={handleClick}>
        {label}
      </Button>
    </Tooltip>
  );
};



const NavigationBar = () => {
  const { limpiarCarrito } = useContext(CartContext);
  const navigate = useNavigate();
  const userName = localStorage.getItem('nombreCompleto') || 'Usuario';
  const rol = localStorage.getItem('rol'); // Obtener el rol del usuario desde localStorage


  const handleLogout = () => {
    // Limpiar datos del usuario en localStorage
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('token'); // Elimina el token de autenticación
    localStorage.removeItem('carrito'); // Elimina el carrito
    localStorage.removeItem('rol'); // Elimina el rol
    localStorage.removeItem('id');
    localStorage.removeItem('estado');
    limpiarCarrito();
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  const operadornavItems = [
    //{ label: 'Productos', path: '/productos', tooltip: 'Ver productos' },
    { label: 'Productos', path: '/productos', tooltip: 'Ir a productos' },
    { label: 'Usuarios', path: '/usuarios', tooltip: 'Ir a usuarios' },
    { label: 'Clientes', path: '/clientes', tooltip: 'Ir a clientes' },
    { label: 'Roles', path: '/roles', tooltip: 'Ir a roles' },
    { label: 'Estados', path: '/estados', tooltip: 'Ir a estados' },
    { label: 'Categorías Productos', path: '/categorias', tooltip: 'Ir a categorías de productos'},
    { label: 'Ordenes', path: '/ordenes', tooltip: 'Ir a ordenes'},
    { path: '/', icon: <LogoutIcon />, tooltip: 'Cerrar sesión', onClick: handleLogout }
  ];

  const clientesnavItems = [
    { path: '/tiendaonline', icon: <StoreIcon />,tooltip: 'Ir a tienda' },
    { path: '/carrito', icon: <ShoppingCartIcon />, tooltip: 'Ir al carrito' },
    { path: '/ordenes', icon: <ReceiptIcon />, tooltip: 'Historial de pedidos'},
    { path: '/', icon: <LogoutIcon />, tooltip: 'Cerrar sesión', onClick: handleLogout }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976D2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mi Tiendita Online
        </Typography>
        

        <AccountCircleIcon sx={{ fontSize: 30, marginRight: 1 }} /> {/* Tamaño ajustable */}
        {/* Nombre de usuario dinámico */}
        <Typography variant="body1" component="div" sx={{ 
            marginRight: 2, 
            fontSize: '1.2rem', 
            fontWeight: 'bold'  
          }}>
          {userName}
        </Typography>

        {/* Botones de navegación */}
        {rol === 'Cliente' && clientesnavItems.map((item, index) => (
          <NavButton
            key={index}
            label={item.label}
            path={item.path}
            icon={item.icon}
            tooltip={item.tooltip}
            onClick={item.onClick}
          />
        ))}

        {/* Botones de navegación */}
        {rol === 'Operador' && operadornavItems.map((item, index) => (
          <NavButton
            key={index}
            label={item.label}
            path={item.path}
            icon={item.icon}
            tooltip={item.tooltip}
            onClick={item.onClick}
          />
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
