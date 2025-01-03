export function formatearMoneda(valor) {
    return valor.toLocaleString('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    });
  }