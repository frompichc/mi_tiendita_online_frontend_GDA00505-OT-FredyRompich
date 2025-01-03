import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import SelectField from '../UI/Inputs/SelectField';
import TituloH2 from '../UI/Outputs/TituloH2';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
    nombre_comercial: Yup.string().required('El nombre completo es obligatorio'),
    estado_idEstado: Yup.string().required('El estado es obligatorio'),
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

function ModificarCliente() {
 
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
                    id: estado.idEstado, 
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
        const fetchCliente = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/clientes?idCliente=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const clienteData = await response.json();
                    methods.reset({
                        nombre_comercial: clienteData.data[0].nombre_comercial,
                        estado_idEstado: clienteData.data[0].estado_idEstado,
                        razon_social: clienteData.data[0].razon_social,
                        direccion_entrega: clienteData.data[0].direccion_entrega,
                        telefono: clienteData.data[0].telefono,
                        email: clienteData.data[0].email,
                    });
                    setIsLoading(false);
                } else {
                    setMensaje(`Error al cargar datos del cliente`);
                    setTipoMensaje('error');
                    setAbrirSnackbar(true);
                    setTimeout(() => navigate('/clientes'), 1500);
                }
            } catch (error) {
                setMensaje(`Error al obtener cliente: ${error}`);
                setTipoMensaje('error');
                setAbrirSnackbar(true);
                setTimeout(() => navigate('/clientes'), 1500);
            }
        };

        fetchCliente();
    }, [id, methods, navigate]);

  // Función para enviar los datos actualizados
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('Cliente modificado exitosamente');
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
      setMensaje(`Error al modificar cliente: ${error}`);
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
        <TituloH2 titulo={'EDITAR CLIENTES'}/>

        {!isLoading && (<CampoTextoEntrada
            name="nombre_comercial"
            label="Nombre comercial"
            required
        />)}

        {!isLoading && (<SelectField
            name="estado_idEstado"
            label="Estado"
            options={estados}
            required
        />)}

        {!isLoading && (<CampoTextoEntrada
            name="razon_social"
            label="Razón social"
            required
        />)}

        {!isLoading && (<CampoTextoEntrada
            name="direccion_entrega"
            label="Dirección"
            required
        />)}
         {!isLoading && (<CampoTextoEntrada
            name="telefono"
            label="Número de teléfono"
            type="text"
            required
        />)}
        {!isLoading && (<CampoTextoEntrada
            name="email"
            label="Correo electrónico"
            type="email"
            required
        />)}      

        <BotonAceptar texto="ACTUALIZAR" />

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


export default ModificarCliente;
