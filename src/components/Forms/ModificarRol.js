import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import SelectField from '../UI/Inputs/SelectField';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import TituloH2 from '../UI/Outputs/TituloH2';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre del rol es obligatorio'),
  estado_idEstado: Yup.string().required('El estado es obligatorio'),
});

function ModificarRol() {
  const [estados, setEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

   useEffect(() => {
      const fetchEstados = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/estados?e_nombre=Inactivo', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          const transformedData = data.data.map(estado => ({
            id: estado.idEstado, // Cambiar 'idCategoria' a 'id'
            nombre: estado.nombre,
          }));
          setEstados(transformedData); 
        } catch (error) {
          console.error('Error al obtener las categorías:', error);
        }
      };
  
      fetchEstados();
    }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/roles?idRol=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const rolData = await response.json();
          methods.reset({
            nombre: rolData.data[0].nombre,
            estado_idEstado: rolData.data[0].estado_idEstado
          });
          setIsLoading(false);
       } else {
          setMensaje(`Error al cargar datos del rol`);
          setTipoMensaje('error');
          setAbrirSnackbar(true);
          setTimeout(() => navigate('/roles'), 1500);
        }
      } catch (error) {
        setMensaje(`Error al obtener el rol: ${error}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/roles'), 1500);
      }
    };
    fetchRol();
  }, [id, methods, navigate]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('Rol modificado exitosamente');
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/roles'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }
    } catch (error) {
      setMensaje(`Error al modificar el rol: ${error}`);
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
        <TituloH2 titulo='EDITAR ROL'/>

        {!isLoading && (<CampoTextoEntrada
          name="nombre"
          label="Nombre del Rol"
          required
          value={methods.getValues("nombre")}
        />)}

        {!isLoading && (<SelectField
          name="estado_idEstado"
          label="Estado"
          options={estados}
          required
        />)}

        <BotonAceptar texto="ACTUALIZAR ROL" />

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

export default ModificarRol;
