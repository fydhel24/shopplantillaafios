import React, { createContext, useContext, useState } from 'react';

// Definimos la estructura de cada producto en el carrito
export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  discount?: number;
  couponCode?: string;
  customPrice?: number | null;
  
}

// Definimos el tipo de contexto del carrito
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Omit<Product, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  getTotal: () => string;
  getTotalItems: () => number;
  clearCart: () => void;
  applyCoupon: (productId: number, couponCode: string) => Promise<string>;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  updatePriceManually: (id: number, newPrice: number) => void;
}

// Creamos el contexto del carrito
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto del carrito
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);

  // Función para añadir productos al carrito
  const addToCart = (product: Omit<Product, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(item => item.id === product.id);

      if (existingProduct) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        triggerCartAnimation();
        return [...prevItems, { ...product, quantity: 1,  discount: product.discount ?? 0 }];
      }
    });
  };

  // Función para actualizar un producto específico
  const updateProduct = (id: number, updates: Partial<Product>) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  // Función para actualizar el precio manualmente de un producto
  const updatePriceManually = (id: number, newPrice: number) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, customPrice: newPrice } : item
      )
    );
  };

  // Función para eliminar productos del carrito
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  // Función para aumentar la cantidad de un producto
  const incrementQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    triggerCartAnimation();
  };

  // Función para reducir la cantidad de un producto
  const decrementQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Función para calcular el total, considerando los descuentos y precios manuales
  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const priceToUse = item.customPrice !== null && item.customPrice !== undefined ? item.customPrice : item.price;
        const totalItemPrice = priceToUse * item.quantity;
        const totalDiscount = item.discount ? (priceToUse * (item.discount / 100)) * item.quantity : 0;
        return sum + (totalItemPrice - totalDiscount);
      }, 0)
      .toFixed(2);
  };

  // Función para calcular el número total de productos en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Dispara una animación para el ícono del carrito
  const triggerCartAnimation = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
  };

  // Función para aplicar cupón - ahora siempre devuelve una promesa con string
  const applyCoupon = async (productId: number, couponCode: string): Promise<string> => {
    try {
      // Lógica para aplicar cupón - esto es solo un ejemplo
      const discountAmount = 10; // Ejemplo: 10% de descuento
      
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, discount: discountAmount, couponCode }
            : item
        )
      );
      return "Cupón válido y aplicado con éxito";
    } catch (error) {
      console.error("Error al aplicar el cupón:", error);
      return "Error al aplicar el cupón";
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        getTotal,
        getTotalItems,
        clearCart,
        applyCoupon,
        updateProduct,
        updatePriceManually,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};