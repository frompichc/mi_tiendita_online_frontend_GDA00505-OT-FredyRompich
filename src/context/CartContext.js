import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [carritoProductos, setCarritoProductos] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
      setCarritoProductos(carritoGuardado);
    }
  }, []);

  // Función para agregar un producto al carrito con cantidad
  const agregarAlCarrito = (producto, cantidad) => {
    const productoExistente = carritoProductos ? carritoProductos.find(item => item.idProducto === producto.idProducto) : null;

    if (cantidad > producto.stock || (productoExistente && (productoExistente.cantidad + cantidad > producto.stock))) {
      return `No puedes agregar más de ${producto.stock} ${producto.nombre} al carrito.`;
    }
    
    setCarritoProductos((prevItems) => {
      let nuevoCarrito;
      if (productoExistente) {
        nuevoCarrito = prevItems.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        const productoGuardar = {
          idProducto : producto.idProducto,
          nombre: producto.nombre,
          marca: producto.marca,
          precio: producto.precio,
          foto: producto.foto
        }
        // Agregar nuevo producto con la cantidad especificada
        nuevoCarrito = [...prevItems, { ...productoGuardar, cantidad }];
      }
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); 
      return nuevoCarrito;
    });
    return null;
  };

  // Función para eliminar un producto del carrito
  const eliminarProductoCarrito = (idProducto) => {
    setCarritoProductos((prevItems) => {
      const nuevoCarrito = prevItems.filter(item => item.idProducto !== idProducto);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); 
      return nuevoCarrito;
    });
  };

  // Función para limpiar el carrito
  const limpiarCarrito = () => {
    setCarritoProductos([]);
    localStorage.removeItem('carrito'); 
  };

  return (
    <CartContext.Provider value={{ carritoProductos, agregarAlCarrito, limpiarCarrito, eliminarProductoCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
