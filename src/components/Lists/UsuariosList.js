import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonAgregar from '../UI/Buttons/BotonAgregar';
import BotonEditar from '../UI/Buttons/BotonEditar';
import BotonEliminar from '../UI/Buttons/BotonEliminar';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import TituloH1 from '../UI/Outputs/TituloH1';
import Message from '../UI/Outputs/Message';
import ConfirmDeleteDialog from '../UI/Dialogs/ConfirmDeleteDialog';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';
import BotonReiniciarContrasena from '../UI/Buttons/BotonReiniciarContrasena';
import { Box } from '@mui/material';


function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [UsuarioToDelete, setUsuarioToDelete] = useState(null); 
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/usuarios?estado_e_nombreEstado=Inactivo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener los usuarios');
        const data = await response.json();
        setUsuarios(data.data);
      } catch (err) {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [refresh]);

  const handleDeleteClick = (idUsuario) => {
    setUsuarioToDelete(idUsuario);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };


  const deleteUsuario = async () => {
    if (!UsuarioToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/usuarios/${UsuarioToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario con id :' + UsuarioToDelete);

      setRefresh(!refresh);
      setMensaje('Usuario eliminado con éxito');
      setTipoMensaje('success');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('No se pudo eliminar el usuario');
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Cierra el diálogo sin eliminar
  };

  if (loading) return <Message type="loading">Cargando usuarios...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  const headers = ['ID', 'Nombre', 'Correo electrónico', 'Teléfono', 'Acciones'];
  const tableData = usuarios.map((usuario) => ({
    idUsuario: usuario.idUsuario,
    nombre: usuario.nombre_completo,
    correo_electronico: usuario.correo_electronico,
    telefono: usuario.telefono,
    acciones: (
      <Box>
        <BotonEditar
          tooltip="Editar usuario"
          onClick={() => navigate('/usuarios/modificar/' + usuario.idUsuario)}
        />
        <BotonEliminar
          tooltip="Eliminar usuario"
          onClick={() => handleDeleteClick(usuario.idUsuario)}
        />
        <BotonReiniciarContrasena
          tooltip="Reiniciar contraseña"
          onClick={() => navigate('/usuarios/reiniciar/' + usuario.idUsuario)}
        />
      </Box>
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'USUARIOS'}/>
      <BotonAgregar 
        tooltip='Agregar nuevo usuario' 
        onClick={() => navigate('/usuarios/ingresar')}
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

       {/* Usamos el componente ConfirmDeleteDialog */}
       <ConfirmDeleteDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={deleteUsuario}
          id={UsuarioToDelete}
          texto={'Estas seguro que quieres eliminar categoría con ID: '}
        />

        <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
          tipo={tipoMensaje}
        />
    </div>
  );
}

export default UsuariosList;
