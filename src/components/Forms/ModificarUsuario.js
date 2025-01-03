import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import SelectField from '../UI/Inputs/SelectField';
import TituloH2 from '../UI/Outputs/TituloH2';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = (clienteRolId) => Yup.object({
  nombre_completo: Yup.string().required('El nombre completo es obligatorio'),
  estado_idEstado: Yup.string().required('El estado es obligatorio'),
  correo_electronico: Yup.string()
    .email('El correo electrónico debe ser válido')
    .required('El correo electrónico es obligatorio'),
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
});

function ModificarUsuario() {
 
  const [estados, setEstados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [clienteRolId, setClienteRolId] = useState(null);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema(clienteRolId)),
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
        setEstados(transformedData); // Guardar las categorías obtenidas
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
  
      fetchEstados();
  }, []);


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
    }, 
  []);
    
  const { id } = useParams(); 
  const navigate = useNavigate();

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
            estado_idEstado: usuarioData.data[0].estado_idEstado,
            correo_electronico: usuarioData.data[0].correo_electronico,
            telefono: usuarioData.data[0].telefono,
            rol_idRol: usuarioData.data[0].rol_idRol,
            cliente_idCliente: usuarioData.data[0].cliente_idCliente || '',
          });
          setIsLoading(false);
        } else {
          setMensaje(`Error al cargar datos del usuario`);
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

  const onSubmit = async (data) => {
    try {
      if (!data.cliente_idCliente  ||  rolId !== clienteRolId) {
        data.cliente_idCliente = null; 
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('Usuario modificado con éxito');
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
      setMensaje(`Error al conectar con el servidor. ${error}`);
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
        <TituloH2 titulo={'EDITAR USUARIO'}/>

        {!isLoading && (<CampoTextoEntrada
          name="nombre_completo"
          label="Nombre de usuario"
          required
        />)}

        {!isLoading && (<SelectField
          name="estado_idEstado"
          label="Estado"
          options={estados}
          required
        />)}

        {!isLoading && (<CampoTextoEntrada
          name="correo_electronico"
          label="Correo de usuario"
          type="email"
          required
        />)}

        {!isLoading && (<CampoTextoEntrada
          name="telefono"
          label="Número de teléfono"
          type="text"
          required
        />)}

        {!isLoading && (<SelectField
          name="rol_idRol"
          label="Rol"
          options={roles}
          required
        />)}

        {!isLoading && rolId === clienteRolId && (<SelectField
          name="cliente_idCliente"
          label="Cliente"
          options={clientes}
          required={rolId === clienteRolId}
        />)}

        <BotonAceptar texto="ACTUALIZAR USUARIO" />

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


export default ModificarUsuario;
