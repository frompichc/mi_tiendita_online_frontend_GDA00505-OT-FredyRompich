import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import TituloH2 from '../UI/Outputs/TituloH2';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre de la categoría de producto es obligatorio'),
});

function IngresarCategoriaProducto() {

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  
  const navigate = useNavigate(); // Hook para redirección programática
    
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/categoriaproductos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setMensaje(`Categoría de producto ingresada con éxito`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/categorias'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }    
    } catch (error) {
      setMensaje(`Error al agregar la categoría de producto: ${error}`);
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
        <TituloH2 titulo='AGREGAR CATEGORIA DE PRODUCTO'/>
  
        <CampoTextoEntrada
          name="nombre"
          label="Nombre de Categoría de Producto"
          required
        />
     
        <BotonAceptar texto="CREAR CATEGORIA DE PRODUCTO" />

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

export default IngresarCategoriaProducto;