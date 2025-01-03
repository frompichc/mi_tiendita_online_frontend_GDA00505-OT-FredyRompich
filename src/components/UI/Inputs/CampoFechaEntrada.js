import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

const CampoFecha = ({ name, label, required = false }) => {
  const { register, setValue, formState: { errors } } = useFormContext(); // Obtener contexto de react-hook-form

  const [fecha, setFecha] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;

    // Validar y formatear la entrada
    const formattedValue = formatDate(value);
    setFecha(formattedValue);

    // Sincronizar con react-hook-form
    setValue(name, formattedValue, { shouldValidate: true });
  };

  const formatDate = (value) => {
    // Eliminar caracteres no numéricos
    const cleanedValue = value.replace(/\D/g, '');

    // Formatear a DD/MM/YYYY
    const day = cleanedValue.substring(0, 2);
    const month = cleanedValue.substring(2, 4);
    const year = cleanedValue.substring(4, 8);

    let formattedDate = '';
    if (day) formattedDate += day;
    if (month) formattedDate += '/' + month;
    if (year) formattedDate += '/' + year;

    return formattedDate;
  };

  return (
    <TextField
      {...register(name, { required })}
      label={label}
      value={fecha}
      onChange={handleChange}
      placeholder="DD/MM/YYYY"
      fullWidth
      error={!!errors[name]}
      helperText={errors[name]?.message}
    />
  );
};

export default CampoFecha;
