import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import CampoMonedaEntrada from '../UI/Inputs/CampoMonedaEntrada';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import SelectField from '../UI/Inputs/SelectField';
import TituloH2 from '../UI/Outputs/TituloH2';
import ImageUploader from '../UI/Inputs/ImageUploader';
import { useNavigate } from 'react-router-dom';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

// Esquema de validación con Yup
const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre del producto es obligatorio'),
  precio: Yup.number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser mayor que 0')
    .typeError('El precio debe ser un número válido'),
  marca: Yup.string().required('La marca del producto es obligatoria'),
  codigo: Yup.string().required('El código del producto es obligatorio'),
  categoriaProducto_idCategoriaProducto: Yup.string().required('La categoría del producto es obligatoria'),
  stock: Yup.number()
    .required('El stock del producto es obligatorio')
    .positive('El stock del producto debe ser mayor a 0')
    .typeError('El precio debe ser un número válido')
});

function IngresarProducto() {
  const [categorias, setCategorias] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate(); // Hook para redirección programática

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/categoriaproductos?estado_e_nombreEstado=Inactivo',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const transformedData = data.data.map((categoria) => ({
          id: categoria.idCategoriaProducto,
          nombre: categoria.nombre,
        }));
        setCategorias(transformedData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const data = { ...formData, foto: selectedImage };
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje(`Producto agregado con éxito`);
        setTipoMensaje('success');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/productos'), 1500);
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(2000);
      }
    } catch (error) {
      setMensaje(`Error al agregar el producto: ${error}`);
      setTipoMensaje('error');
      setAbrirSnackbar(true);
      setTimeout(2000);
    }
  };

  const handleCloseSnackbar = () => {
    setAbrirSnackbar(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}
      >
        <TituloH2 titulo = {'AGREGAR PRODUCTO'}/>

        <CampoTextoEntrada
          name="nombre"
          label="Nombre del Producto"
          required
        />
        <CampoMonedaEntrada
          name="precio"
          label="Precio del Producto"
          required
        />
        <CampoTextoEntrada
          name="marca"
          label="Marca del Producto"
          required
        />
        <CampoTextoEntrada
          name="codigo"
          label="Código del Producto"
          required
        />
        <SelectField
          name="categoriaProducto_idCategoriaProducto"
          label="Categoría Producto"
          options={categorias}
          required
        />
        <CampoTextoEntrada
          name="stock"
          label="Cantidad de Producto"
          type="number"
          required
        />
        <ImageUploader
          name="fotoProducto"
          label="Foto del Producto"
          alt="Vista previa"
          onImageChange={setSelectedImage} // Guarda la imagen seleccionada en el estado
        />
        <BotonAceptar texto={'CREAR PRODUCTO'} />

        <SnackBarPersonalizable
          abrir={abrirSnackbar}
          cerrar={handleCloseSnackbar}
          mensaje={mensaje}
          tipo={tipoMensaje}
        />
      </form>
    </FormProvider>
  );
}

export default IngresarProducto;
