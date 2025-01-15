import React, { useState } from 'react';
import AgregarCarritoIcon from '@mui/icons-material/AddShoppingCart';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import { formatearMoneda } from '../../../utils/formatearMoneda';

const ProductCard = ({ producto, agregarAlCarrito }) => {
  const [cantidad, setCantidad] = useState(1);
  const imagenNoDisponible = '/images/imagennodisponible.png';

  const handleCantidadChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setCantidad(value);
  };

  const handleAgregarAlCarrito = () => {
      agregarAlCarrito(producto, cantidad);
      setCantidad(1);
  };

  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        width: '200px',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <img
        src={producto.foto || imagenNoDisponible}
        alt={producto.nombre}
        style={{
          width: '100%',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
      />
      <Typography variant="h6" sx={{ margin: '10px 0', fontWeight: '600' }}>
        {producto.nombre}
      </Typography>
      <Typography variant="body2" sx={{ margin: '5px 0', color: '#777', fontStyle: 'italic' }}>
        {producto.marca}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'bold', margin: '5px 0', fontSize: '1.1em' }}>
        {formatearMoneda(producto.precio)}
      </Typography>


      {producto.stock === 0 && (
      <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>
        ¡Producto no disponible!
      </Typography>)}

      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={handleCantidadChange}
        style={{
          width: '60px',
          margin: '8px 0',
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px',
          fontSize: '1em',
        }}
        aria-label="Cantidad"
        disabled={producto.stock === 0} 
      />
      <Tooltip title='Agregar al carrito' arrow>
        <IconButton
          onClick={handleAgregarAlCarrito}
          sx={{
            margin: '10px',
            backgroundColor: '#1976D2',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
          }}
          aria-label="Agregar al carrito"
          disabled={producto.stock === 0} 
        >
          <AgregarCarritoIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ProductCard;