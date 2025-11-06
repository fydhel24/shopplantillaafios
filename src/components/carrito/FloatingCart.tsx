import React from "react";
import { useCart } from "./CarritoContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import "./FloatingCart.css";

// Define las propiedades esperadas por el componente
interface FloatingCartProps {
  isCartOpen: boolean;
  onClose: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ isCartOpen, onClose }) => {
  const {
    cartItems,
    getTotal,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si la ruta es una de las rutas mayoristas
  const isMayoristaRoute =
    location.pathname.startsWith("/categoriamayor") ||
    location.pathname.startsWith("/productosmayoristas") ||
    location.pathname.startsWith("/main") ||
    location.pathname.startsWith("/productomayor");

  const handleCheckout = () => {
    onClose();
    if (isMayoristaRoute) {
      navigate("/pago1");
    } else {
      navigate("/pago");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex justify-end items-start pt-20 sm:pt-6 pr-4 bg-black bg-opacity-70 z-50 font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-900 text-white rounded-xl shadow-2xl w-full sm:w-96 max-h-[90vh] sm:max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-gray-700 pb-2 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black-300">
                Tu Carrito
              </h2>
              <button
                className="text-gray-400 hover:text-black-400 transition-colors"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 p-4 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                  <ShoppingCart size={48} className="mb-4 text-gray-700" />
                  <p className="text-lg font-medium">Tu carrito está vacío.</p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center bg-gray-800 p-3 rounded-lg shadow-inner"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0 border border-gray-700"
                    />
                    <div className="ml-3 sm:ml-4 flex-grow">
                      {/* Aquí se ajusta el tamaño de la fuente para el nombre del producto */}
                      <h3 className="font-serif text-xs sm:text-sm text-red-100">
                        {item.name}
                      </h3>

                      <p className="text-red-300 font-bold mt-1 text-sm sm:text-base">
                        Bs.{item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 sm:ml-4">
                      <button
                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-gray-100 text-lg">
                        {item.quantity}
                      </span>
                      <button
                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-500 ml-2 sm:ml-4 transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-4 pt-2 sm:mt-6 sm:pt-4 border-t border-gray-700 px-4 sm:px-6 pb-4 sm:pb-6">
              <h4 className="text-xl sm:text-2xl font-extrabold flex justify-between items-center mb-2">
                <span>Total:</span>
                <span className="text-cyan-300">Bs.{getTotal()}</span>
              </h4>
              <button
                className={`text-white font-bold py-3 px-4 rounded-full w-full mt-2 sm:mt-4 transition-colors shadow-lg ${
                  isMayoristaRoute
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
                onClick={handleCheckout}
              >
                {isMayoristaRoute ? "Ir a Pagar (Mayorista)" : "Ir a Pagar"}
              </button>
              <button
                className="bg-gray-800 text-gray-300 font-bold py-3 px-4 rounded-full w-full mt-2 hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                Seguir Comprando
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
