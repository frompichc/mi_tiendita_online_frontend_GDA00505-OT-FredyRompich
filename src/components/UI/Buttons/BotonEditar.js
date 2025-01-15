import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonEditarIcono from '@mui/icons-material/Edit';


const BotonEditar = ({ onClick, tooltip }) => {

  return (
    <Tooltip title={tooltip} arrow>
        <IconButton 
            onClick={onClick}
            sx={{
                color: '#FF9800',
                '&:hover': {
                    color: '#FB8C00', 
                },
            }}
        >
            <BotonEditarIcono/>
        </IconButton>
    </Tooltip>
  );
};

export default BotonEditar;
