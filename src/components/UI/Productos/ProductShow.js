import React from 'react';
import ProductCard from './ProductCard';

const ProductShow = ( {productos, agregarAlCarrito } ) => {

    return (
        <div style={listStyle}>
            {productos.map(producto => (
                <ProductCard
                    key={producto.idProducto} 
                    producto={producto}
                    agregarAlCarrito={agregarAlCarrito} 
                />
            ))}
        </div>
    );
};

const listStyle = { display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' };

export default ProductShow;