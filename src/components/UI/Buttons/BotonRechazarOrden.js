import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BotonRechazarOrdenIcono from '@mui/icons-material/ThumbDown';

const BotonRechazarOrden = ({ onClick, tooltip, disabled }) => {
  
    return (
      <Tooltip title={tooltip} arrow>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: '#F44336',
            '&:hover': {
              color: '#D32F2F', 
            },
          }}
        >
          <BotonRechazarOrdenIcono/>
        </IconButton>
      </Tooltip>    
    );
  };
  
  export default BotonRechazarOrden;