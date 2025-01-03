import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonReiniciarContrasenaIcono from '@mui/icons-material/LockReset';

// Componente reutilizable para los botones de acción
const BotonReiniciarContrasena = ({ onClick, tooltip }) => {
  // Según el tipo de acción, mostramos el icono correspondiente

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        sx={{
          color: '#4CAF50',
          '&:hover': {
            color: '#388E3C',
          },
        }}
      >
        <BotonReiniciarContrasenaIcono/>
      </IconButton>
    </Tooltip>
  );
};

export default BotonReiniciarContrasena;
