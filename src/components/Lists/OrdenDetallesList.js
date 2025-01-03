import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import TituloH1 from '../UI/Outputs/TituloH1';
import Message from '../UI/Outputs/Message';
import { Paper, Typography, Box } from '@mui/material';
import { formatearMoneda } from '../../utils/formatearMoneda';

function OrdenDetallesList() {
  const [ordenDetalles, setOrdenDetalles] = useState([]);
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchOrdenDetalles = async () => {
      try {
        const token = localStorage.getItem('token');

        const ordenResponse = await fetch(`http://localhost:5000/ordenes?idOrden=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!ordenResponse.ok) throw new Error('Error al obtener información de la orden');
        const ordenData = await ordenResponse.json();
        setOrden(ordenData.data[0]);

        const response = await fetch(`http://localhost:5000/ordendetalles?orden_idOrden=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener detalle de orden');
        const data = await response.json();
        setOrdenDetalles(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenDetalles();
  }, [id]);

  if (loading) return <Message type="loading">Cargando detalle de ordenes...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const headers = ['ID', 'Producto', 'Cantidad', 'Precio', 'Subtotal'];
  const tableData = ordenDetalles.map((ordenDetalle) => ({
    idOrdenDetalle: ordenDetalle.idOrdenDetalle,
    producto: ordenDetalle.producto_nombre,
    cantidad: ordenDetalle.cantidad,
    precio: formatearMoneda(ordenDetalle.precio),
    subtotal: formatearMoneda(ordenDetalle.subtotal),
  }));

  return (
    <div>
      <TituloH1 titulo={'DETALLE DE ORDEN'} />

      {/* Encabezado con información de la orden */}
      {orden && (

<Paper elevation={3} style={{ padding: '16px', margin: '16px 0' }}>
  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
  <Box flex="1">
      <Typography variant="body1"><strong>Cliente:</strong> {orden.razon_social}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="body1"><strong>Fecha Creación:</strong> {orden.fecha_creacion}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="body1"><strong>Fecha Entrega:</strong> {orden.fecha_entrega}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="body1"><strong>Total:</strong> {formatearMoneda(orden.total_orden)}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="body1"><strong>Estado:</strong> {orden.estado_nombreEstado}</Typography>
    </Box>

  </Box>

</Paper>

)}

      <TablaMuestraDatos headers={headers} data={tableData} />
    </div>
  );
}

export default OrdenDetallesList;