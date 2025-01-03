import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonEntregarOrdenIcono from '@mui/icons-material/LocalShipping';

const BotonEntregarOrden = ({ onClick, tooltip, disabled }) => {
    // Según el tipo de acción, mostramos el icono correspondiente
  
    return (
      <Tooltip title={tooltip} arrow>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: '#4CAF50',
            '&:hover': {
              color: '#388E3C', 
            },
          }}
        >
          <BotonEntregarOrdenIcono/>
        </IconButton>
      </Tooltip>
    );
  };
  
  export default BotonEntregarOrden;
  