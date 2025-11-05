import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useCart } from "../carrito/CarritoContext";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  stock: number;
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const availableProducts = products.filter((product) => product.stock > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (availableProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.max(1, availableProducts.length - 3)
      );
    }, 7000);
    return () => clearInterval(timer);
  }, [availableProducts.length]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const maxIndex = Math.max(0, availableProducts.length - 4);
    if (info.offset.x > 120) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else if (info.offset.x < -120) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.nombre,
      price: Number.parseFloat(product.precio_extra),
      img: product.imageUrl || "/placeholder.jpg",
    });
  };

  const getVisibleProducts = () => {
    if (availableProducts.length === 0) return [];
    const result = [];
    for (let i = 0; i < 4; i++) {
      const productIndex = (currentIndex + i) % availableProducts.length;
      result.push(availableProducts[productIndex]);
    }
    return result;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div className="relative bg-white text-gray-800 overflow-hidden py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header formal */}
        <div className="text-center mb-16">
          <h3 className="text-sm uppercase text-red-600 font-semibold tracking-widest mb-2">
            Colección destacada
          </h3>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800">
            Explora nuestros productos
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Encuentra los mejores artículos disponibles en nuestra tienda.
          </p>
        </div>

        {/* Carrusel */}
        {availableProducts.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                drag="x"
                dragConstraints={containerRef}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-grab active:cursor-grabbing"
              >
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
                  >
                    {/* Imagen del producto */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.nombre}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                        Stock: {product.stock}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col items-center text-center">
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">
                        {product.nombre}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {product.descripcion
                          .split("\r\n")
                          .slice(0, 1)
                          .join(" ")}
                      </p>

                      <div className="text-red-600 font-semibold text-lg mb-3">
                        Bs. {product.precio_extra}
                      </div>

                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-md"
                      >
                        Comprar ahora
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Indicadores */}
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({
                length: Math.max(1, availableProducts.length - 3),
              }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-red-600"
                      : "w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>

            {/* Navegación por flechas */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
              <motion.button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                className="pointer-events-auto bg-white border border-gray-300 text-gray-700 p-3 rounded-full shadow-sm hover:bg-gray-100 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentIndex === 0}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={() =>
                  setCurrentIndex(
                    Math.min(
                      Math.max(0, availableProducts.length - 4),
                      currentIndex + 1
                    )
                  )
                }
                className="pointer-events-auto bg-white border border-gray-300 text-gray-700 p-3 rounded-full shadow-sm hover:bg-gray-100 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={
                  currentIndex >= Math.max(0, availableProducts.length - 4)
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-24">
            <div className="text-center bg-gray-50 border border-gray-200 px-10 py-8 rounded-2xl shadow-md">
              <p className="text-lg font-medium text-gray-700">
                No hay productos disponibles
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Vuelve pronto para ver nuestras nuevas ofertas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
