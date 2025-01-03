import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [carritoProductos, setCarritoProductos] = useState([]);

  // Cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
      setCarritoProductos(carritoGuardado);
    }
  }, []);

  // Función para agregar un producto al carrito con cantidad
  const agregarAlCarrito = (producto, cantidad) => {
    setCarritoProductos((prevItems) => {
      const existente = prevItems.find((item) => item.idProducto === producto.idProducto);

      let nuevoCarrito;
      if (existente) {
        // Incrementar la cantidad del producto existente
        nuevoCarrito = prevItems.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Agregar nuevo producto con la cantidad especificada
        nuevoCarrito = [...prevItems, { ...producto, cantidad }];
      }

      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Guardar el carrito en localStorage
      return nuevoCarrito;
    });
  };

  // Función para eliminar un producto del carrito
  const eliminarProductoCarrito = (idProducto) => {
    setCarritoProductos((prevItems) => {
      const nuevoCarrito = prevItems.filter(item => item.idProducto !== idProducto);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualizar localStorage
      return nuevoCarrito;
    });
  };

  // Función para limpiar el carrito
  const limpiarCarrito = () => {
    setCarritoProductos([]);
    localStorage.removeItem('carrito'); // Limpiar el carrito de localStorage
  };

  return (
    <CartContext.Provider value={{ carritoProductos, agregarAlCarrito, limpiarCarrito, eliminarProductoCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
