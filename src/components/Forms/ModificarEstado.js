import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import TituloH2 from '../UI/Outputs/TituloH2';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre del estado es obligatorio'),
});

function ModificarEstado() {

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);



  const { id } = useParams(); // Obtener el ID del rol desde la URL
  const navigate = useNavigate();

  // Cargar los datos existentes del rol al iniciar el formulario
  useEffect(() => {
    const fetchEstado = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/estados?idEstado=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const estadoData = await response.json();
          methods.reset({
            nombre: estadoData.data[0].nombre,     
        }); // Prellenar el formulario
        setIsLoading(false);
        } else {
          setMensaje(`Error al cargar los datos del estado.`);
          setTipoMensaje('error');
          setAbrirSnackbar(true);
          setTimeout(() => navigate('/estados'), 1500);
        }
      } catch (error) {
        setMensaje(`Error al obtener el estado: ${error}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/estados'), 1500);
      }
    };

    fetchEstado();
  }, [id, methods, navigate]);

  // Función para enviar los datos actualizados
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/estados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje(`Estado modificado con éxito`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/estados'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }
    } catch (error) {
      setMensaje(`Error al modificar el estado: ${error}`);
      setTipoMensaje('error');
      setAbrirSnackbar(true);
      setTimeout(2000);
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
        <TituloH2 titulo={'EDITAR ESTADO'}/>

        {!isLoading && (<CampoTextoEntrada
          name="nombre"
          label="Nombre del Estado"
          placeholder="Ingrese el nombre del estado"
          required
        />)}

        <BotonAceptar texto="ACTUALIZAR ESTADO" />

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

export default ModificarEstado;
