import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonAgregar from '../UI/Buttons/BotonAgregar';
import BotonEditar from '../UI/Buttons/BotonEditar';
import BotonEliminar from '../UI/Buttons/BotonEliminar';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import TituloH1 from '../UI/Outputs/TituloH1';
import Message from '../UI/Outputs/Message';
import { formatearMoneda } from '../../utils/formatearMoneda';
import ConfirmDeleteDialog from '../UI/Dialogs/ConfirmDeleteDialog';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';


function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // Estado para refrescar la lista
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Para abrir el diálogo de eliminación
  const [ProductoToDelete, setProductoToDelete] = useState(null); // 
  const [mensaje, setMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/productos?estado_e_nombreEstado=Inactivo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener los productos');
        const data = await response.json();
        setProductos(data.data);
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [refresh]);

  const handleDeleteClick = (idProdcuto) => {
    setProductoToDelete(idProdcuto);
    setOpenDeleteDialog(true); // Abre el diálogo de confirmación
  };

  const deleteProducto = async () => {
    if (!ProductoToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/productos/${ProductoToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el producto con id :' + ProductoToDelete);

      setRefresh(!refresh); 
      setMensaje('Producto eliminado con éxito');
      setAbrirSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto');
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Cierra el diálogo sin eliminar
  };

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  if (loading) return <Message type="loading">Cargando productos...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const headers = ['ID', 'Nombre', 'Precio', 'Marca', 'Stock', 'Código', 'Acciones'];
  const tableData = productos.map((producto) => ({
    idProdcuto: producto.idProducto,
    nombre: producto.nombre,
    precio: formatearMoneda(producto.precio), 
    marca: producto.marca,
    stock: producto.stock,
    codigo: producto.codigo,
    acciones: (
      <div>
        <BotonEditar
          tooltip = 'Editar producto'
          onClick={() => navigate('/productos/modificar/' + producto.idProducto)}
        />

        <BotonEliminar
          tooltip = 'Eliminar producto'
          onClick={() => handleDeleteClick(producto.idProducto)}
        />
      </div>
    ),
  }));

  return (
    <div>
      <TituloH1 titulo={'PRODUCTOS'}/>
      <BotonAgregar 
        tooltip='Agregar nuevo producto' 
        onClick={() => navigate('/productos/ingresar')}
      />
      <TablaMuestraDatos headers={headers} data={tableData} />

        {/* Usamos el componente ConfirmDeleteDialog */}
        <ConfirmDeleteDialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={deleteProducto}
          id={ProductoToDelete}
          texto={'Estas seguro que quieres eliminar producto con ID: '}
        />

        <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
        />
    </div>
  );
}

export default ProductosList;
