import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

function CampoMonedaEntrada({ name, label, required, defaultValue }) {
    const { register, setValue, formState: { errors } } = useFormContext();

    return (
        <div style={{ marginBottom: '15px' }}>
            <NumericFormat
                {...register(name, { required })}
                label={label}
                fullWidth
                error={!!errors[name]}
                helperText={errors[name]?.message}
                variant="outlined"
                margin="normal"
                customInput={TextField}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'GTQ '}
                value={defaultValue} 
                onValueChange={(values) => {
                    const { value } = values;
                    setValue(name, value); 
                }}
            />
        </div>
    );
}

export default CampoMonedaEntrada;