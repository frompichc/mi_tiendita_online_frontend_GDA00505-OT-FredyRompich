import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import TituloH2 from '../UI/Outputs/TituloH2';
import { useNavigate } from 'react-router-dom';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre del estado es obligatorio'),
});

function IngresarEstado() {

  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate(); 
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/estados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },      
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje(`Estado agregado con éxito`);
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
      setMensaje(`Error al agregar el estado: ${error}`);
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
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
        <TituloH2 titulo={'AGREGAR ESTADO'}/>
    
        <CampoTextoEntrada
          name="nombre"
          label="Nombre del Estado"
          placeholder="Ingrese el nombre del estado"
          required
        />
      
        <BotonAceptar texto="CREAR ESTADO" />

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

export default IngresarEstado;