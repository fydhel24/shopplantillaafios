import React, { useState, useEffect } from 'react';
import { useCart } from '../carrito/CarritoContext';
import { styles } from './Styles';
import axios from 'axios';

const Paso1: React.FC = () => {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getTotal,
    updatePriceManually,
    applyCoupon,
  } = useCart();

  const [showCouponInput, setShowCouponInput] = useState(false); // Controla la visibilidad del campo de cupón
  const [couponCode, setCouponCode] = useState(''); // Estado para el código del cupón
  const [editablePrices, setEditablePrices] = useState<boolean>(false); // Controla si los precios son editables
  const [validationStatus, setValidationStatus] = useState<{ status: 'valid' | 'invalid' | 'unset'; message?: string }>(
    { status: 'unset' }
  );

  const [manualPrices, setManualPrices] = useState<{ [key: number]: number | undefined }>({});

  const handleApplyCoupon = async (productId: number, couponCode: string) => {
    const resultMessage = await applyCoupon(productId, couponCode);
    setValidationStatus({
      status: resultMessage === 'Cupón válido y aplicado con éxito' ? 'valid' : 'invalid',
      message: resultMessage || '',
    });
  };

  const handlePriceChange = (productId: number, newPrice: string) => {
    if (newPrice === '') {
      // Si el campo está vacío, no muestra ningún valor y no afecta al precio original
      setManualPrices((prev) => ({
        ...prev,
        [productId]: undefined, // Mantén el estado interno vacío
      }));
    } else {
      const parsedPrice = parseFloat(newPrice.replace(',', '.')); // Permitir tanto comas como puntos
      if (!isNaN(parsedPrice) && parsedPrice >= 0) {
        updatePriceManually(productId, parsedPrice); // Actualiza el precio manualmente
        setManualPrices((prev) => ({
          ...prev,
          [productId]: parsedPrice,
        }));
      }
    }
  };

  // Validar cupón automáticamente cuando el código cambie
  useEffect(() => {
    const validateCoupon = async () => {
      if (!couponCode) return; // Si el campo está vacío no hace nada

      try {
        // Llamada a la API de cupones para obtener la lista de cupones disponibles
        const response = await axios.get('https://importadoramiranda.com/api/cupos');
        const validCoupon = response.data.find(
          (c: any) => c.codigo === couponCode && c.estado.toUpperCase() === 'ACTIVO'
        );

        if (!validCoupon) {
          setValidationStatus({
            status: 'invalid',
            message: 'Cupón inválido o no activo',
          });
          setEditablePrices(false); // Deshabilitar la edición de precios si el cupón es inválido
          return;
        }

        const currentDate = new Date();
        const startDate = validCoupon.fecha_inicio ? new Date(validCoupon.fecha_inicio) : null;
        const endDate = validCoupon.fecha_fin ? new Date(validCoupon.fecha_fin) : null;

        if ((startDate && currentDate < startDate) || (endDate && currentDate > endDate)) {
          setValidationStatus({
            status: 'invalid',
            message: 'Cupón expirado o no vigente',
          });
          setEditablePrices(false);
          return;
        }

        setValidationStatus({
          status: 'valid',
          message: 'Cupón válido y aplicado con éxito.',
        });
        setEditablePrices(true);
      } catch (error) {
        console.error('Error al validar el cupón:', error);
        setValidationStatus({
          status: 'invalid',
          message: 'Hubo un error al validar el cupón',
        });
        setEditablePrices(false);
      }
    };

    validateCoupon();
  }, [couponCode]);

  return (
    <div style={styles.step}>
      <h2 style={styles.title}>Paso 1: Revisar productos</h2>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        cartItems.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.productItem,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              transition: 'transform 0.3s ease-in-out',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 60%' }}>
              <img
                src={product.img}
                alt={product.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  marginRight: '15px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{product.name}</span>
                <p style={{ marginTop: '5px', fontSize: '1rem', color: '#555' }}>
                  Bs.{' '}
                  {manualPrices[product.id] !== undefined
                    ? manualPrices[product.id]?.toFixed(2)
                    : (product.customPrice ?? product.price).toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 40%', justifyContent: 'space-around' }}>
              <button
                style={{
                  ...styles.button,
                  marginRight: '10px',
                  padding: '2px 10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => decrementQuantity(product.id)}
                disabled={product.quantity === 1}
              >
                -
              </button>
              <span style={{ margin: '0 10px', fontSize: '1rem' }}>{product.quantity}</span>
              <button
                style={{
                  ...styles.button,
                  padding: '2px 10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => incrementQuantity(product.id)}
              >
                +
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => removeFromCart(product.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {editablePrices && (
              <div style={{ flex: '1 1 100%', marginTop: '10px' }}>
                <input
                  type="text" // Cambiado a "text" para permitir borrar completamente el valor
                  value={
                    manualPrices[product.id] !== undefined
                      ? manualPrices[product.id]?.toString().replace('.', ',') // Mostrar el valor con formato adecuado
                      : '' // Mostrar el campo vacío si no hay valor definido
                  }
                  onChange={(e) => handlePriceChange(product.id, e.target.value)}
                  style={{
                    ...styles.input,
                    width: '100%',
                    padding: '8px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Editar precio"
                />
              </div>
            )}
          </div>
        ))
      )}

      <div style={{ marginTop: '20px', flexWrap: 'wrap', display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '1 1 100%', marginBottom: '10px', fontSize: '1rem' }}>
          <input
            type="checkbox"
            checked={showCouponInput}
            onChange={() => setShowCouponInput(!showCouponInput)}
            style={{ marginRight: '10px' }}
          />
          Ingresar código de cupón
        </label>
        {showCouponInput && (
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
            placeholder="Escribe tu código de cupón"
          />
        )}
      </div>

      {validationStatus.status === 'invalid' && (
        <p style={{ color: 'red', marginTop: '5px', fontSize: '1rem' }}>{validationStatus.message}</p>
      )}
      {validationStatus.status === 'valid' && (
        <p style={{ color: 'green', marginTop: '5px', fontSize: '1rem' }}>{validationStatus.message}</p>
      )}

      <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <p>Total con descuento aplicado: Bs. {getTotal()}</p>
      </div>
    </div>
  );
};

export default Paso1;
