import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTextoEntrada from '../UI/Inputs/CampoTextoEntrada';
import SelectField from '../UI/Inputs/SelectField';
import ImageUploader from '../UI/Inputs/ImageUploader';
import TituloH2 from '../UI/Outputs/TituloH2';
import BotonAceptar from '../UI/Buttons/BotonAceptar';
import CampoMonedaEntrada from '../UI/Inputs/CampoMonedaEntrada';
import SnackBarPersonalizable from '../UI/Outputs/SnackBarPersonalizable';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre del producto es obligatorio'),
   precio: Yup.number()
      .required('El precio es obligatorio')
      .positive('El precio debe ser mayor que 0')
      .typeError('El precio debe ser un número válido'),
    marca: Yup.string().required('La marca del producto es obligatoria'),
    codigo: Yup.string().required('El código del producto es obligatorio'),
    estado_idEstado: Yup.string().required('El código de estado es obligatorio'),
    categoriaProducto_idCategoriaProducto: Yup.string().required('La categoría del producto es obligatoria'),
    stock: Yup.number()
      .required('El stock del producto es obligatorio')
      .positive('El stock del producto debe ser mayor a 0')
      .typeError('El precio debe ser un número válido')
});

function ModificarProducto() {
 
  const [estados, setEstados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mensaje, setMensaje] = useState(''); 
  const [tipoMensaje, setTipoMensaje] = useState(''); 
  const [abrirSnackbar, setAbrirSnackbar] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/estados?e_nombre=Inactivo', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const transformedData = data.data.map(estado => ({
          id: estado.idEstado, 
          nombre: estado.nombre,
        }));
        setEstados(transformedData); 
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
  
      fetchEstados();
  }, []);


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
    
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/productos?idProducto=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const productoData = await response.json();
          methods.reset({
            nombre: productoData.data[0].nombre,
            estado_idEstado: productoData.data[0].estado_idEstado,
            precio: productoData.data[0].precio,
            marca: productoData.data[0].marca,
            codigo: productoData.data[0].codigo,
            categoriaProducto_idCategoriaProducto: productoData.data[0].categoriaProducto_idCategoriaProducto,
            stock: productoData.data[0].stock,
            foto: productoData.data[0].foto,
          });
          setImage(productoData.data[0].foto);
          setIsLoading(false);
        } else {
          setMensaje(`Error al cargar datos del producto`);
          setTipoMensaje('error');
          setAbrirSnackbar(true);
          setTimeout(() => navigate('/productos'), 1500);
        }
      } catch (error) {
        setMensaje(`Error al obtener productos: ${error}`);
        setTipoMensaje('error');
        setAbrirSnackbar(true);
        setTimeout(() => navigate('/productos'), 1500);
      }
    };

    fetchProducto();
  }, [id, methods, navigate]);

  // Función para enviar los datos actualizados
  const onSubmit = async (formData) => {
    try {
      const data = {...formData, foto: selectedImage || image}
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('Producto modificado exitosamente');
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
      setMensaje(`Error al modificar producto: ${error}`);
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
        <TituloH2 titulo={'EDITAR PRODUCTO'}/>

        {!isLoading && (<CampoTextoEntrada
          name="nombre"
          label="Nombre del Producto"
          required
        />)}

        {!isLoading && (<SelectField
          name="estado_idEstado"
          label="Estado"
          options={estados}
          required
        />)}

        {!isLoading && (<CampoMonedaEntrada
          name="precio"
          label="Precio del Producto"
          type="number"
          required
          defaultValue={methods.getValues("precio")}
        />)}

        {!isLoading && ( <CampoTextoEntrada
          name="marca"
          label="Marca del Producto"
          required
        />)}

        {!isLoading && (<CampoTextoEntrada
          name="codigo"
          label="Código del Producto"
          required
        />)}

        {!isLoading && (<SelectField
          name="categoriaProducto_idCategoriaProducto"
          label="Categoría Producto"
          options={categorias}
          required
        />)}

        {!isLoading && (<CampoTextoEntrada
          name="stock"
          label="Cantidad de Producto"
          type="number"
          required
        />)}

        {!isLoading && (<ImageUploader
          name="fotoProducto"
          label="Foto del Producto"
          alt="Vista previa"
          initialImage={image}
          onImageChange={setSelectedImage} // Guarda la imagen seleccionada en el estado
        />)}

        <BotonAceptar texto="ACTUALIZAR" />

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


export default ModificarProducto;
