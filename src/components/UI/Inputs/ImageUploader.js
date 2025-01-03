import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Typography, Card, CardContent, CardMedia } from '@mui/material';

function ImageUploader({ name, label, onImageChange, alt, required, initialImage }) {
  const [imagePreview, setImagePreview] = useState(null);
  const { formState: { errors } } = useFormContext();

  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage); // Establece la imagen de modificación
    }
  }, [initialImage]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que el archivo sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result; // Leer el string completo en Base64
        onImageChange(base64String); // Enviar la imagen en Base64 al componente padre
      };

      reader.readAsDataURL(file); // Leer archivo como Data URL (Base64 incluido)
      
      // Crear vista previa de la imagen
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h6" component="div" style={{ marginBottom: '10px' }}>
        {label}
      </Typography>

      <input
        type="file"
        id="imageUploader"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }} // Ocultamos el input por defecto
      />

     

      {
        imagePreview && (
          <Card sx={{ marginTop: '20px' }}>
            <CardMedia
              component="img"
              height="200"
              fullWidth
              image={imagePreview}
              alt={alt}
              sx={{
                objectFit: 'contain',
                width: '100%'
              }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Vista previa de la imagen
              </Typography>
            </CardContent>
          </Card>
        )
      }

      <label htmlFor="imageUploader">
        <Button variant="contained" color="primary" component="span">
          Seleccionar Imagen
        </Button>
      </label>

      {errors[name] && (
        <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
          {errors[name].message}
        </Typography>
      )}
    </div>
  );
}

export default ImageUploader;
