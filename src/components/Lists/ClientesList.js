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

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // Estado para refrescar la lista
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Para abrir el diálogo de eliminación
  const [ClienteToDelete, setClienteToDelete] = useState(null); // ID del cliente a eliminar
  const [mensaje, setMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/clientes?estado_e_nombreEstado=Inactivo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener clientes');
        const data = await response.json();
        setClientes(data.data);
      } catch (error) {
        setError('Error al cargar clientes: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [refresh]);

  const handleDeleteClick = (idCliente) => {
    setClienteToDelete(idCliente);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };

  const deleteCliente = async () => {
    if (!ClienteToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/clientes/${ClienteToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar cliente con id ' + ClienteToDelete);

      setMensaje('Cliente eliminado con éxito');
      setAbrirSnackbar(true); // Abre el Snackbar
      setRefresh(!refresh); // Refresca la lista de clientes
      setOpenDeleteDialog(false); // Cierra el diálogo de confirmación
    } catch (error) {
      console.error('Error al eliminar cliente', error);
      alert('No se pudo eliminar cliente');
      setOpenDeleteDialog(false); // Cierra el diálogo de confirmación
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Cierra el diálogo sin eliminar
  };

  if (loading) return <Message type="loading">Cargando clientes...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  const headers = ['ID', 'Nombre', 'Razón Social', 'Estado', 'Acciones'];
  const tableData = clientes.map((cliente) => ({
    idCliente: cliente.idCliente,
    nombre_comercial: cliente.nombre_comercial,
    razon_social: cliente.razon_social,
    estado_nombreEstado: cliente.estado_nombreEstado,
    acciones: (
      <div>
        <BotonEditar
          tooltip="Editar cliente"
          onClick={() => navigate('/clientes/modificar/' + cliente.idCliente)}
        />
        <BotonEliminar
          tooltip="Eliminar cliente"
          onClick={() => handleDeleteClick(cliente.idCliente)} // Abre el diálogo de eliminación
        />
      </div>
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'CLIENTES'} />
      <BotonAgregar
        tooltip="Agregar nuevo cliente"
        onClick={() => navigate('/clientes/ingresar')}
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

      {/* Usamos el componente ConfirmDeleteDialog */}
        <ConfirmDeleteDialog
            open={openDeleteDialog}
            onClose={handleDeleteCancel}
            onConfirm={deleteCliente}
            id={ClienteToDelete}
            texto={'Estas seguro que quieres eliminar cliente con ID: '}
        />

       {/* Componente SnackBarPersonalizable */}

       <SnackBarPersonalizable
            abrir={abrirSnackbar}
            cerrar={handleCloseSnackbar}
            mensaje={mensaje}
        />
    </div>
  );
}

export default ClientesList;