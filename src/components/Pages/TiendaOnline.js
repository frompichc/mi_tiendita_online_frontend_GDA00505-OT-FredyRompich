import React, { useEffect, useState, useContext } from 'react';
import ProductShow from '../UI/Productos/ProductShow';
import Message from '../UI/Outputs/Message';
import { CartContext } from '../../context/CartContext';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';
import TituloH1 from '../UI/Outputs/TituloH1';

function TiendaOnline() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  

  const { agregarAlCarrito } = useContext(CartContext);

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
  }, []);

  const manejarAgregarAlCarrito = (producto, cantidad) => {
    if (cantidad > producto.stock) {
      setMensaje(`No puedes agregar más de ${producto.stock} ${producto.nombre} al carrito.`);
      setAbrirSnackbar(true);
      return; 
    }

    agregarAlCarrito(producto, cantidad);
    setMensaje(`Agregaste ${cantidad} ${producto.nombre} al carrito!`);
    setAbrirSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };


  if (loading) return <Message type="loading">Cargando productos...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <div>
      <TituloH1 titulo={'MI TIENDITA ONLINE'}/>
      <ProductShow productos={productos} agregarAlCarrito={manejarAgregarAlCarrito} />
      <SnackBarPersonalizable
        abrir={abrirSnackbar}
        cerrar={handleCloseSnackbar}
        mensaje={mensaje}
      />
    </div>
  );
}



export default TiendaOnline;
