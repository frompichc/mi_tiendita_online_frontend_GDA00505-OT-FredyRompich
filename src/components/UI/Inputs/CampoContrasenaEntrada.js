import React, { useState } from "react";
import { useFormContext } from 'react-hook-form';
import { TextField, IconButton, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CampoContrasenaEntrada = ({name, label, required}) => {
  const { register, formState: { errors } } = useFormContext(); // Obtener contexto de react-hook-form
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ marginBottom: '15px' }}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
          <TextField
            {...register(name, { required })}
            label={label}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            error={!!errors[name]} // Si hay errores, marcar el campo como error
            helperText={errors[name]?.message} // Mostrar el mensaje de error
            fullWidth
          />
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none", // Permite que el mouse pase a través de este contenedor
            }}
          >
            <IconButton
              onClick={togglePasswordVisibility}
              style={{
                pointerEvents: "auto", // Asegura que el botón siga siendo clicable
              }}
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
      </Box>
    </div>
  );
};


export default CampoContrasenaEntrada;
