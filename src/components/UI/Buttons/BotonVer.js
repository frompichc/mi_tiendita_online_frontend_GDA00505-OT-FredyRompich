import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonVerIcono from '@mui/icons-material/Visibility';

// Componente reutilizable para los botones de acción
const BotonVer = ({ onClick, tooltip }) => {
  // Según el tipo de acción, mostramos el icono correspondiente


  return (
    <Tooltip title={tooltip} arrow>
        <IconButton onClick={onClick} sx={{color:'#1976D2', '&:hover': {
                    color: '#1565C0', 
                },
                }}>
            <BotonVerIcono/>
        </IconButton>
    </Tooltip>
  );
};

export default BotonVer;