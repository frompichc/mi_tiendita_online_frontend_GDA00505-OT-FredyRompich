import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TituloH1 from '../UI/Outputs/TituloH1';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import Message from '../UI/Outputs/Message';
import BotonAgregar from '../UI/Buttons/BotonAgregar';
import BotonEditar from '../UI/Buttons/BotonEditar';
import BotonEliminar from '../UI/Buttons/BotonEliminar';
import ConfirmDeleteDialog from '../UI/Dialogs/ConfirmDeleteDialog';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';


function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // Estado para refrescar la lista
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Para abrir el diálogo de eliminación
  const [RolToDelete, setRolToDelete] = useState(null); // ID del cliente a eliminar
  const [mensaje, setMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/roles?estado_e_nombreEstado=Inactivo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener los roles');
        const data = await response.json();
        setRoles(data.data);
      } catch (err) {
        setError('Error al cargar los roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [refresh]);

  const handleDeleteClick = (idRol) => {
    setRolToDelete(idRol);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };

  const deleteRol = async () => {
    if (!RolToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/roles/${RolToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el rol con id ' + RolToDelete);

      setRefresh(!refresh);
      setMensaje('Rol eliminado con éxito');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
      alert('No se pudo eliminar el rol');
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Cierra el diálogo sin eliminar
  };

  if (loading) return <Message type="loading">Cargando roles...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  const headers = ['ID', 'Nombre', 'Estado', 'Acciones'];
  const tableData = roles.map((rol) => ({
    idRol: rol.idRol,
    nombre: rol.nombre,
    estado: rol.estado_nombreEstado,
    acciones: (
      <div>
        <BotonEditar
          tooltip = 'Editar rol'
          onClick={() => navigate('/roles/modificar/' + rol.idRol)}
        />

        <BotonEliminar
          tooltip='Eliminar rol'
          onClick={() => handleDeleteClick(rol.idRol)}
        />
      </div>
      
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'ROLES'}/>
      <BotonAgregar
        tooltip = 'Agregar nuevo rol'
        onClick={() => navigate('/roles/ingresar')}
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

       {/* Usamos el componente ConfirmDeleteDialog */}
       <ConfirmDeleteDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={deleteRol}
          id={RolToDelete}
          texto={'Estas seguro que quieres eliminar categoría con ID: '}
        />

        <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
        />
    </div>
  );
}

export default RolesList;
