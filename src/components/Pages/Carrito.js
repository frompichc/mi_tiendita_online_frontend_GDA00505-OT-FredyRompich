import React, { useContext, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CartContext } from '../../context/CartContext';
import TituloH2 from '../UI/Outputs/TituloH2';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import BotonCancelar from '../UI/Buttons/BotonCancelar';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import BotonEliminar from '../UI/Buttons/BotonEliminar';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import { formatearMoneda } from '../../utils/formatearMoneda';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  telefono: Yup.string()
    .required('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos'),
  direccion: Yup.string()
    .required('La dirección es obligatoria'),
  correo_electronico: Yup.string()
    .email('El correo electrónico no es válido') // Mensaje de error si no es un correo válido
    .required('El correo electrónico es obligatorio'), // Mensaje de 
});


const Carrito = () => {
  const { carritoProductos, limpiarCarrito, eliminarProductoCarrito } = useContext(CartContext);
  const imagenNoDisponible = '/images/imagennodisponible.png';
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Estado para manejar la visibilidad del formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Calcular el total del carrito
  const calcularTotal = () => {
    // Sumar el total sin formatear
    const total = carritoProductos.reduce((acumulador, producto) => {
      return acumulador + producto.precio * producto.cantidad;
    }, 0); // Valor inicial del acumulador
  
    // Formatear el total como moneda
    return formatearMoneda(total);
  };
  
  

  const handleConfirmar = () => {
    setMostrarFormulario(true);
  };


const onSubmit = async (data) => {
  try {
    const ordenConDetalle = {
      usuario_idUsuario: localStorage.getItem('id'), // Cambia esto según el usuario actual
      direccion: data.direccion,
      telefono: data.telefono,
      correo_electronico: data.correo_electronico,
      fecha_entrega: new Date().toISOString().split('T')[0], // Fecha actual
      total_orden: calcularTotal(),
      Detalles: carritoProductos.map(producto => ({
        producto_idProducto: producto.idProducto,
        cantidad: producto.cantidad,
        precio: producto.precio,
      })),
  
    };
  
    // Aquí puedes enviar el JSON a tu API
    console.log('JSON a enviar:', JSON.stringify(ordenConDetalle));
  
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      
      body: JSON.stringify(ordenConDetalle),
    });
  
    if (response.ok) {
      alert('Orden creada con éxito');
      setMostrarFormulario(false);
      limpiarCarrito();
      navigate('/tiendaonline');
    } else {
      const errorData = await response.json();
      console.log(errorData);
      alert(`Error: ${errorData.message}`);
    }

  } catch (error) {
  console.error('Error al crear la orden:', error);
  alert('Error al conectar con el servidor.');
}
  // Reiniciar el formulario y el carrito
  
}

  if (carritoProductos.length === 0) {
    return (
      <Box sx={styles.container}>
        <TituloH2 titulo='CARRITO DE COMPRAS' />
        <Typography variant="h6" align="center">El carrito está vacío.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.cart}>
      <TituloH2 titulo='CARRITO DE COMPRAS' />
      <List sx={styles.list}>
        {carritoProductos.map((producto) => (
          <ListItem key={producto.idProducto} sx={styles.item}>
            <ListItemAvatar>
              <Avatar src={producto.foto || imagenNoDisponible} alt={producto.nombre} sx={styles.image} />
            </ListItemAvatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" fontWeight="bold">{producto.nombre}</Typography>
              <Typography variant="body2">Marca: {producto.marca}</Typography>
              <Typography variant="body2">Precio: Q{producto.precio.toFixed(2)}</Typography>
              <Typography variant="body2">Cantidad: {producto.cantidad}</Typography>
              <Typography variant="body2">Total: Q{(producto.precio * producto.cantidad).toFixed(2)}</Typography>
            </Box>
            <BotonEliminar onClick={() => eliminarProductoCarrito(producto.idProducto)} tooltip='Eliminar producto de carrito'/>
          </ListItem>
        ))}
      </List>

      <Box sx={styles.footer}>
        <Typography variant="h6"><strong>Total del Carrito: {calcularTotal()}</strong></Typography>
        <Box sx={styles.buttonContainer}>
          <BotonAceptar texto='CONFIRMAR'ancho='200px' onClick={handleConfirmar} type='button'/>
          <BotonCancelar texto='LIMPIAR CARRITO' ancho='200px' onClick={limpiarCarrito} />
        </Box>
      </Box>


      {mostrarFormulario && (
        <FormProvider {...methods}>
        <Box sx={styles.formContainer}>
          <Typography variant="h6">Información de Entrega</Typography>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CampoTextoEntrada
              name="telefono"
              label="Número de Teléfono"
              placeholder="Ingrese número de teléfono"
              required
            />

            <CampoTextoEntrada
              name="direccion"
              label="Dirección de Entrega"
              placeholder="Ingresa dirección de Entrega"
              required
            />

            <CampoTextoEntrada
              name="correo_electronico"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              required
            />

            <BotonAceptar texto='Enviar' ancho='200px'/>
          </form>
        </Box>
        </FormProvider>
      )}
    </Box>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  cart: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  list: {
    padding: 0,
  },
  item: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  footer: {
    textAlign: 'right',
    marginTop: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
};

export default Carrito;