import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonEliminarIcono from '@mui/icons-material/Delete';

const BotonEliminar = ({ onClick, tooltip }) => {
  return (
    <Tooltip title={tooltip} arrow>
        <IconButton
          onClick={onClick}
          sx={
            {
              color:'#F44336',
              '&:hover': {
                    color: '#D32F2F', 
                },
              }}
        >
            <BotonEliminarIcono/>
        </IconButton>
    </Tooltip>
  );
};

export default BotonEliminar;
