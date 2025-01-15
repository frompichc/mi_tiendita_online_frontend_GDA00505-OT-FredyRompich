import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonReiniciarContrasenaIcono from '@mui/icons-material/LockReset';

const BotonReiniciarContrasena = ({ onClick, tooltip }) => {

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
