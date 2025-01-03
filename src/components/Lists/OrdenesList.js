import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonVer from '../UI/Buttons/BotonVer';
import TablaMuestraDatos from '../UI/Outputs/TablaMuestraDatos';
import TituloH1 from '../UI/Outputs/TituloH1';
import Message from '../UI/Outputs/Message';
import BotonEntregarOrden from '../UI/Buttons/BotonEntregarOrden';
import BotonRechazarOrden from '../UI/Buttons/BotonRechazarOrden';
import { formatearMoneda } from '../../utils/formatearMoneda';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

function OrdenesList() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const navigate = useNavigate();

  const rol = localStorage.getItem('rol');

  const fetchOrdenes = async () => {
    try {
      const idUsuario = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      let response = null;
      if (rol === 'Operador') {
        response = await fetch(`http://localhost:5000/ordenes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (rol === 'Cliente') {
        response = await fetch(`http://localhost:5000/ordenes?usuario_idUsuario=${idUsuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
     
      if (!response.ok) throw new Error('Error al obtener ordenes');
      const data = await response.json();
      setOrdenes(data.data);
    } catch (err) {
      setError('Error al cargar ordenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, [rol]);

  const operaOrden = async (idOrden, accion) => {
    try {
      const token = localStorage.getItem('token');
      let response = null;

      if (accion === 'E') {
        response = await fetch(`http://localhost:5000/ordenes/entregar/${idOrden}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Corregido aquí
          },
        });
      } else if (accion === 'R') {
        response = await fetch(`http://localhost:5000/ordenes/rechazar/${idOrden}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Corregido aquí
          },
        });
      }

      if (response.ok) {
        setMensaje(`Orden ${accion === 'E' ? 'entregada' : 'rechazada'}`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        fetchOrdenes();
      } else {
        alert('Error al operar orden');
      }
    } catch (error) {
      setError('Error al operar orden');
    }
  };

  if (loading) return <Message type="loading">Cargando ordenes...</Message>;
  if (error) return <Message type="error">{error}</Message>;

  const headers = rol === 'Operador' 
    ? ['ID Orden', 'Cliente', 'Teléfono Contacto', 'Usuario', 'Correo electrónico', 'Estado', 'Total Orden', 'Acciones']
    : ['ID', 'Dirección entrega', 'Teléfono Contacto', 'Correo electrónico', 'Estado', 'Total Orden', 'Acciones'];

  let tableData = [];
  if (rol === 'Operador') {
    tableData = ordenes.map((orden) => {
      return {
        idOrden: orden.idOrden,
        cliente: orden.razon_social,
        telefono: orden.telefono,
        usuario: orden.nombre_completo,
        correo_electronico: orden.correo_electronico,
        estado_nombreEstado: orden.estado_nombreEstado,
        total_orden: formatearMoneda(orden.total_orden),
        acciones: (
          <div>
            <BotonVer
              tooltip='Ver detalle de orden'
              onClick={() => navigate(`/ordendetalles/${orden.idOrden}`)}
            />
            <BotonEntregarOrden
              tooltip='Entregar orden'
              onClick={() => operaOrden(orden.idOrden, 'E')}
              disabled={orden.estado_nombreEstado !== 'Activo'}
            />
            < BotonRechazarOrden
              tooltip='Rechazar orden'
              onClick={() => operaOrden(orden.idOrden, 'R')}
              disabled={orden.estado_nombreEstado !== 'Activo'}
            />
          </div>
        ),
      };
    });
  } else if (rol === 'Cliente') {
    tableData = ordenes.map((orden) => {
      return {
        idOrden: orden.idOrden,
        direccion: orden.direccion,
        telefono: orden.telefono,
        correo_electronico: orden.correo_electronico,
        estado_nombreEstado: orden.estado_nombreEstado,
        total_orden: formatearMoneda(orden.total_orden),
        acciones: (
          <div>
            <BotonVer
              tooltip='Ver detalle de orden'
              onClick={() => navigate(`/ordendetalles/${orden.idOrden}`)}
            />
          </div>
        ),
      };
    });
  }

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  return (
    <div>
      <TituloH1 titulo={'HISTORIAL DE ORDENES'} />
      <TablaMuestraDatos headers={headers} data={tableData} />

      <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
          tipo={tipoMensaje}
        />
    </div>
  );
}

export default OrdenesList;