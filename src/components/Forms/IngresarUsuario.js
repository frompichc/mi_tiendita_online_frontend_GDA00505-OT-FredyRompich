import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import SelectField from '../UI/Inputs/SelectField';
import TituloH2 from '../UI/Outputs/TituloH2';
import { useNavigate } from 'react-router-dom';
import CampoContrasenaEntrada from '../UI/Inputs/CampoContrasenaEntrada';
import CampoFechaEntrada from '../UI/Inputs/CampoFechaEntrada';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const mayorEdad = (dateString) => {
  const today = new Date();
  const [day, month, year] = dateString.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};

const validationSchema = (clienteRolId) => Yup.object({
  nombre_completo: Yup.string().required('El nombre completo es obligatorio'),
  correo_electronico: Yup.string()
    .email('El correo electrónico debe ser válido')
    .required('El correo electrónico es obligatorio'),
  password_usuario: Yup.string().required('La contraseña es obligatoria'),
  telefono: Yup.string()
    .required('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos')
    .matches(/^[0-9]+$/, 'El número de teléfono debe ser numérico'),
  rol_idRol: Yup.string().required('El rol es obligatorio'),
  cliente_idCliente: Yup.string().test('cliente-required', 'El cliente es obligatorio', function(value) {
    const { rol_idRol } = this.parent;
    if (Number(rol_idRol) === clienteRolId) {
      return value ? true : false; 
    }
    return true;  
  }),
  fecha_nacimiento: Yup.string()
    .required('La fecha es obligatoria')
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'El formato de la fecha debe ser DD/MM/YYYY')
    .test('mayor-edad', 'Debes ser mayor de 18 años', (value) => {
      if (!value) return false;
      return mayorEdad(value) >= 18;
    }),
});

function IngresarUsuario() {
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteRolId, setClienteRolId] = useState(null);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  

  const methods = useForm({
    resolver: yupResolver(validationSchema(clienteRolId)), // Pasa el clienteRolId a la validación
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/roles?estado_e_nombreEstado=Inactivo',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const transformedData = data.data.map((rol) => ({
          id: rol.idRol,
          nombre: rol.nombre,
        }));
        setRoles(transformedData);
        const clienteRol = transformedData.find(rol => rol.nombre === 'Cliente');
        if (clienteRol) {
          setClienteRolId(clienteRol.id);
        }
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/clientes',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const transformedData = data.data.map((cliente) => ({
          id: cliente.idCliente,
          nombre: cliente.razon_social,
        }));
        setClientes(transformedData);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const onSubmit = async (data) => {
    try {

       // Verifica si cliente_idCliente está vacío y establece en null si es necesario

      if (!data.cliente_idCliente ||  rolId !== clienteRolId ) {
        data.cliente_idCliente = null;
      }
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      console.log('response.ok',response);
      if (response.ok) {
        setMensaje(`Usuario agregado con éxito`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/usuarios'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }
    } catch (error) {
      setMensaje(`Error al agregar el usuario: ${error}`);
      setTipoMensaje('error');
      setAbrirSnackbar(true);
      setTimeout(2000);
    }
  };

  const rolId = useWatch({
    name: 'rol_idRol',
    control: methods.control,
    defaultValue: ''
  });

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}
      >
        <TituloH2 titulo={'AGREGAR USUARIO'} />

        <CampoTextoEntrada
          name="nombre_completo"
          label="Nombre de usuario"
          required
        />
        <CampoTextoEntrada
          name="correo_electronico"
          label="Correo de usuario"
          type="email"
          required
        />
        <CampoContrasenaEntrada
          name="password_usuario"
          label="Contraseña"
          required
        />
        <CampoTextoEntrada
          name="telefono"
          label="Número de teléfono"
          type="text"
          required
        />
        <SelectField
          name="rol_idRol"
          label="Rol"
          options={roles}
          required
        />
        {rolId === clienteRolId && (<SelectField
          name="cliente_idCliente"
          label="Cliente"
          options={clientes}
          required={rolId === clienteRolId}
        />)}
        <CampoFechaEntrada
          name="fecha_nacimiento"
          label="Fecha (DD/MM/YYYY)"
          required
        />
        <BotonAceptar texto={'CREAR USUARIO'} />

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

export default IngresarUsuario;