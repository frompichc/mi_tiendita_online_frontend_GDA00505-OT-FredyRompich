import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonAgregarIcono from '@mui/icons-material/Add';

const BotonAgregar = ({ onClick, tooltip }) => {

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        sx={
          {
            color: '#4CAF50',
            display: 'block',
            margin: '0 auto',
            '&:hover': {
              color: '#388E3C', 
            },
          }
        } 
      >
        <BotonAgregarIcono/>
      </IconButton>
    </Tooltip>
  );
};

export default BotonAgregar;
