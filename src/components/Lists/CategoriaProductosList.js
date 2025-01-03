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

function CategoriaProductosList() {
  const [categoriaproductos, setCategoriaProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // Estado para refrescar la lista
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Para abrir el diálogo de eliminación
  const [CategoriaToDelete, setCategoriaToDelete] = useState(null); // ID del cliente a eliminar
  const [mensaje, setMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategoriaProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/categoriaproductos?estado_e_nombreEstado=Inactivo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener las categorías de productos');
        const data = await response.json();
        setCategoriaProductos(data.data);
      } catch (error) {
        setError('Error al cargar las categorías de productos: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriaProductos();
  }, [refresh]);

  const handleDeleteClick = (idCategoriaProducto) => {
    setCategoriaToDelete(idCategoriaProducto);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };

  const deleteCategoriaProducto = async () => {
    if (!CategoriaToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/categoriaproductos/${CategoriaToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar la categoría de producto con id ' + CategoriaToDelete);
      setRefresh(!refresh); 
      setMensaje('Categoría de producto eliminada con éxito');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar la categoría de producto:', error);
      alert('No se pudo eliminar la categoría de producto');
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Cierra el diálogo sin eliminar
  };

  if (loading) return <Message type="loading">Cargando categoria de productos...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  
  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  const headers = ['ID', 'Nombre', 'Estado', 'Acciones'];
  const tableData = categoriaproductos.map((categoriaproducto) => ({
    idCategoriaProducto: categoriaproducto.idCategoriaProducto,
    nombre: categoriaproducto.nombre,
    estado: categoriaproducto.estado_nombreEstado,
    acciones: (
      <div>
        <BotonEditar
          tooltip = 'Editar categoría de producto'
          onClick={() => navigate('/categorias/modificar/' + categoriaproducto.idCategoriaProducto)}
        />

        <BotonEliminar
          tooltip='Eliminar categoría de producto'
          onClick={() => handleDeleteClick(categoriaproducto.idCategoriaProducto)}
        />
      </div>
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'CATEGORIAS DE PRODUCTOS'}/>       
      <BotonAgregar
        tooltip= 'Agregar nueva categoría de producto'
        onClick={() => navigate('/categorias/ingresar')}
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

        {/* Usamos el componente ConfirmDeleteDialog */}
        <ConfirmDeleteDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={deleteCategoriaProducto}
          id={CategoriaToDelete}
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


export default CategoriaProductosList;
