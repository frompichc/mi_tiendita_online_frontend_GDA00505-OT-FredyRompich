import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

function SelectField({ name, label, options, required }) {
  const { register, formState: { errors }, getValues} = useFormContext();

  return (
    <div style={{ marginBottom: '15px' }}>
      <FormControl fullWidth error={!!errors[name]}>
        {label && <InputLabel htmlFor={name}>{label}</InputLabel>}
        <Select
          {...register(name, { required })}
          label={label}
          fullWidth
          defaultValue={getValues(name) || ''}
          id={name}
          sx={{
            textAlign: 'left',
          }}
     
        >
          <MenuItem value="">Seleccione una opción</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
        {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
      </FormControl>
    </div>
  );
}

export default SelectField;
