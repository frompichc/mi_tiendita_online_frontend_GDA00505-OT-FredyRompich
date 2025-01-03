import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import TituloH2 from '../UI/Outputs/TituloH2';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import CampoMostrarTexto from '../UI/Outputs/CampoMostrarTexto';
import CampoContrasenaEntrada from '../UI/Inputs/CampoContrasenaEntrada';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
    password_usuario: Yup.string()
        .required('La contraseña es obligatoria'),
    password_usuario_confirmar: Yup.string()
        .required('La confirmación de la contraseña es obligatoria')
        .oneOf([Yup.ref('password_usuario'), null], 'Las contraseñas deben coincidir'),
});

function ReiniciarContrasena() {
 
    const [isLoading, setIsLoading] = useState(true); 
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); 
    const [abrirSnackbar, setAbrirSnackbar] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { id } = useParams(); // Obtener el ID del rol desde la URL
  const navigate = useNavigate();

  // Cargar los datos existentes del rol al iniciar el formulario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/usuarios?idUsuario=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const usuarioData = await response.json();
          methods.reset({
            nombre_completo: usuarioData.data[0].nombre_completo,
            correo_electronico: usuarioData.data[0].correo_electronico,
            telefono: usuarioData.data[0].telefono,
          });
          setIsLoading(false);
        } else {
          setMensaje(`Error al cargar los datos del usuario`);
          setTipoMensaje('error');
          setAbrirSnackbar(true);
          setTimeout(() => navigate('/usuarios'), 1500); 
        }
      } catch (error) {
        setMensaje(`Error al obtener el usuario: ${error}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/usuarios'), 1500);
      }
    };

    fetchUsuario();
  }, [id, methods, navigate]);

  // Función para enviar los datos actualizados
  const onSubmit = async (formData) => {
    try {
        const data = {
            idUsuario: id,
            password_usuario: formData.password_usuario,
        };
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/reiniciar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        body: JSON.stringify(data),
        });

        if (response.ok) {
          setMensaje('Contraseña reiniciada exitosamente');
          setTipoMensaje('success');
          setAbrirSnackbar(true);
          setTimeout(() => navigate('/usuarios'), 1500);
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
      console.error('Error al modificar contraseña:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}
      >
        <TituloH2 titulo={'REINICIAR CONTRASEÑA'}/>

        {!isLoading && (<CampoMostrarTexto
            name="nombre_completo"
            label="Nombre de usuario"
            required
        />)}

        {!isLoading && (<CampoMostrarTexto
            name="correo_electronico"
            label="Correo de usuario"
            type="email"
            required
        />)}

        {!isLoading && (<CampoMostrarTexto
            name="telefono"
            label="Número de teléfono"
            type="text"
            required
        />)}

        {!isLoading && (<CampoContrasenaEntrada
            name="password_usuario"
            label="Contraseña"
            required
        />)}

        {!isLoading && (<CampoContrasenaEntrada
            name="password_usuario_confirmar"
            label="Confirmar contraseña"
            required
        />)}

   
        <BotonAceptar texto="CONTINUAR" />

        <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
          tipo={tipoMensaje}
        />
      </form>
    </FormProvider>
  );
}


export default ReiniciarContrasena;
