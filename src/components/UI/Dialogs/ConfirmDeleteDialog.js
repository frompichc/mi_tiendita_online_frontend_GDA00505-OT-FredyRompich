// ConfirmDeleteDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

function ConfirmDeleteDialog({ open, onClose, onConfirm, id, texto }) {
    console.log(id);
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title" sx={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}>
        Confirmar eliminación
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#FFFFFF' }}>
        <Typography variant="body1" sx={{ color: '#333333' }}>
          ¿ {texto} {id}?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#F5F5F5' }}>
        <Button onClick={onClose} sx={{ color: '#1976D2' }}>
          Cancelar
        </Button>
        <Button 
          onClick={() => onConfirm(id)} 
          sx={{ backgroundColor: '#F44336', color: '#FFFFFF', '&:hover': { backgroundColor: '#D32F2F' } }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;