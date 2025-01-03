import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import TituloH2 from '../UI/Outputs/TituloH2';
import { useNavigate } from 'react-router-dom';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = () => Yup.object({
  nombre_comercial: Yup.string().required('El nombre completo es obligatorio'),
  razon_social: Yup.string().required('La razón social es obligatoria'),
  direccion_entrega: Yup.string().required('La dirección es obligatoria'),
  email: Yup.string()
    .email('El correo electrónico debe ser válido')
    .required('El correo electrónico es obligatorio'),
  telefono: Yup.string()
    .required('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos')
    .matches(/^[0-9]+$/, 'El número de teléfono debe ser numérico'),
});

function IngresarCliente() {
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema()), // Pasa el clienteRolId a la validación
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      console.log('response.ok',response);
      if (response.ok) {
        setMensaje(`Cliente agregado con éxito`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/clientes'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }
    } catch (error) {
      setMensaje(`Error al agregar cliente: ${error}`);
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
        <TituloH2 titulo={'AGREGAR CLIENTE'} />

        <CampoTextoEntrada
          name="nombre_comercial"
          label="Nombre de cliente"
          required
        />
        <CampoTextoEntrada
          name="razon_social"
          label="Razón Social"
          required
        />
        <CampoTextoEntrada
          name="direccion_entrega"
          label="Dirección"
          required
        />
        <CampoTextoEntrada
          name="telefono"
          label="Número de teléfono"
          type="text"
          required
        />
        <CampoTextoEntrada
          name="email"
          label="Correo electrónico"
          type="email"
          required
        />
        <BotonAceptar texto={'CREAR CLIENTE'} />

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

export default IngresarCliente;