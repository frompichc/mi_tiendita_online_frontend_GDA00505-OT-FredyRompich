import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import TituloH1 from '../UI/Outputs/TituloH1';
import Message from '../UI/Outputs/Message';
import BotonAgregar from '../UI/Buttons/BotonAgregar';
import BotonEditar from '../UI/Buttons/BotonEditar';
import BotonEliminar from '../UI/Buttons/BotonEliminar';
import ConfirmDeleteDialog from '../UI/Dialogs/ConfirmDeleteDialog';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

function EstadosList() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // Estado para refrescar la lista
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Para abrir el diálogo de eliminación
  const [EstadoToDelete, setEstadoToDelete] = useState(null); // ID del cliente a eliminar
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/estados', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener los estados');
        const data = await response.json();
        setEstados(data.data);
      } catch (error) {
        setError('Error al cargar los estados: ' + error.Message );
      } finally {
        setLoading(false);
      }
    };

    fetchEstados();
  }, [refresh]);

  const handleDeleteClick = (idEstado) => {
    setEstadoToDelete(idEstado);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };

  const deleteEstado = async () => {
    if (!EstadoToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/estados/${EstadoToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error al eliminar el estado con id: ${EstadoToDelete}`);

      setRefresh(!refresh); 
      setMensaje('Estado eliminado con éxito');
      setTipoMensaje('success');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      setMensaje(`Error al eliminar el estado: ${error.Message}`);
      setTipoMensaje('error');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); 
  };

  if (loading) return <Message type="loading">Cargando estados...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  const headers = ['ID', 'Nombre', 'Acciones'];
  const tableData = estados.map((estado) => ({
    idEstado: estado.idEstado,
    nombre: estado.nombre,
    acciones: (
      <div>
        <BotonEditar
          tooltip = 'Editar estado'
          onClick={() => navigate('/estados/modificar/' + estado.idEstado)}
        />

        <BotonEliminar
          tooltip = 'Eliminar estado'
          onClick={() => handleDeleteClick(estado.idEstado)}
        />
      </div>
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'ESTADOS'}/>
      <BotonAgregar
        tooltip = 'Agregar nuevo estado'
        onClick={() => navigate('/estados/ingresar')} 
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

       {/* Usamos el componente ConfirmDeleteDialog */}
       <ConfirmDeleteDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={deleteEstado}
          id={EstadoToDelete}
          texto={'Estas seguro que quieres eliminar estado con ID: '}
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

export default EstadosList;
