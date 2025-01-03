import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonAgregarIcono from '@mui/icons-material/Add';

// Componente reutilizable para los botones de acción
const BotonAgregar = ({ onClick, tooltip }) => {
  // Según el tipo de acción, mostramos el icono correspondiente


  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        sx={{
          color: '#4CAF50',
          display: 'block',
          margin: '0 auto',
          '&:hover': {
            color: '#388E3C', // Cambia el color al pasar el mouse
          },
        }}
      >
        <BotonAgregarIcono/>
      </IconButton>
    </Tooltip>
  );
};

export default BotonAgregar;
