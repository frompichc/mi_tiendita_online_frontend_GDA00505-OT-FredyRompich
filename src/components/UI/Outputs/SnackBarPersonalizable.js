import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackBarPersonalizable = ({ abrir, cerrar, mensaje, tipo }) => {
  return (
    <Snackbar
      open={abrir}
      autoHideDuration={3000}
      onClose={cerrar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Fixed position
    >
      <MuiAlert onClose={cerrar} severity={tipo} sx={{ width: '100%' }}>
        {mensaje}
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackBarPersonalizable;