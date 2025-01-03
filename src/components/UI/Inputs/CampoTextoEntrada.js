import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

function CampoTextoEntrada({ name, label, type = 'text', required }) {
  const { register, formState: { errors } } = useFormContext(); // Obtener contexto de react-hook-form

  return (
    <div style={{ marginBottom: '15px' }}>
      <TextField
        {...register(name, { required })}
        label={label}
        type={type}
        fullWidth
        error={!!errors[name]} 
        helperText={errors[name]?.message}
        variant="outlined" 
        margin="normal" 
      />
    </div>
  );
}

export default CampoTextoEntrada;