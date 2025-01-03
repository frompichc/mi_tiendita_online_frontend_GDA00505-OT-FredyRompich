import React, { useEffect }from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import {Box, Paper} from '@mui/material';
import TituloH1 from '../UI/Outputs/TituloH1';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import CampoContrasenaEntrada from '../UI/Inputs/CampoContrasenaEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';

const validationSchema = Yup.object({
  correo_electronico_login: Yup.string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es obligatorio'),
  password_usuario_login: Yup.string()
    .required('El nombre del rol es obligatorio'),
});

// Componente de inicio de sesión
function Login() {

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });


  const { handleSubmit, setError, formState: { errors } } = methods;
  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (token) {
      if (rol === 'Operador') {
        navigate('/ordenes'); // Redirigir al panel de órdenes
      } else if (rol === 'Cliente') {
        navigate('/tiendaonline'); // Redirigir a la tienda
      }
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    const { correo_electronico_login, password_usuario_login } = data;
    // Convertimos los nombres de las propiedades
    try {
      const loginData = {
        correo_electronico: correo_electronico_login,
        password_usuario: password_usuario_login,
      };
  
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( loginData ),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('nombreCompleto', responseData.nombreCompleto);
        localStorage.setItem('rol', responseData.rol);
        localStorage.setItem('id', responseData.id);
        localStorage.setItem('estado', responseData.nombre_estado); 
        if (responseData.rol === 'Operador') {
          navigate('/ordenes'); 
        } else if (responseData.rol === 'Cliente') {
          navigate('/tiendaonline'); 
        }
      } else {
        setError("root", {
          type: "manual",
          message: responseData.message || 'Usuario o contraseña incorrectos',
        });
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError("root", {
        type: "manual",
        message: 'Error al conectar con el servidor.',
      });
    }
  };

  return (
    <FormProvider {...methods}>
    <Box
        sx={{
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: '400px',
            width: '100%',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
        <TituloH1 titulo={'MI TIENDA ONLINE'}/>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CampoTextoEntrada
            name="correo_electronico_login"
            label="Correo Electrónico"
            type="email"
            required
          />
          <CampoContrasenaEntrada
            name="password_usuario_login"
            label="Contraseña"
            required
          />
          {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
          <BotonAceptar texto={'INICIAR SESION'}/>
        </form>
      </Paper>
      </Box>
    </FormProvider>
  );
}

export default Login;