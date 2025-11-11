"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useCart } from "../../carrito/CarritoContext";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  stock: number;
}

export function AnimatedCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-gray-200/30 to-gray-400/40"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-gray-300/20 to-gray-500/30"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-gradient-to-r from-gray-300/10 to-gray-400/20"
        animate={{ scale: [1, 0.8, 1], rotate: [0, 180, 360] }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function ProductCarouselMayor({ products }: { products: Product[] }) {
  const availableProducts = products.filter((product) => product.stock > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  const getProductPairs = () => {
    const pairs = [];
    for (let i = 0; i < availableProducts.length; i += 2) {
      const pair = [availableProducts[i]];
      if (i + 1 < availableProducts.length) {
        pair.push(availableProducts[i + 1]);
      }
      pairs.push(pair);
    }
    return pairs;
  };

  const productPairs = getProductPairs();

  useEffect(() => {
    if (productPairs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productPairs.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [productPairs.length]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setCurrentIndex(
        (prev) => (prev - 1 + productPairs.length) % productPairs.length
      );
    } else if (info.offset.x < -100) {
      setCurrentIndex((prev) => (prev + 1) % productPairs.length);
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

  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden pt-16 mt-[2.5cm]">
      <AnimatedCircles />

      {/* Floating subtle gray particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {productPairs.length > 0 ? (
        <div
          ref={containerRef}
          className="relative h-full container mx-auto px-4 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              drag="x"
              dragConstraints={containerRef}
              onDragEnd={handleDragEnd}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {productPairs[currentIndex].map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-white border border-gray-300 rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-500 group"
                  >
                    {/* Product badge */}
                    <div className="flex justify-between items-start mb-6">
                      <motion.div
                        className="bg-gray-900 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        Oferta Especial
                      </motion.div>
                      <div className="text-right">
                        <div className="text-gray-600 text-sm font-semibold">
                          Stock
                        </div>
                        <div className="text-black font-bold">
                          {product.stock}
                        </div>
                      </div>
                    </div>

                    {/* Product image */}
                    <motion.div
                      className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-gray-100 max-w-xs mx-auto"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.nombre}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Product info */}
                    <div className="space-y-4">
                      <motion.h2
                        className="text-xl lg:text-2xl font-bold leading-tight group-hover:text-gray-800 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {product.nombre}
                      </motion.h2>

                      <motion.p
                        className="text-gray-600 text-sm lg:text-base leading-relaxed font-medium"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {product.descripcion
                          .split("\r\n")
                          .slice(0, 2)
                          .join(" ")}
                      </motion.p>

                      {/* Price and button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                        <div>
                          <div className="text-gray-600 text-sm font-semibold">
                            Precio mayorista
                          </div>
                          <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Bs.{product.precio_extra}
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 group"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Agregar</span>
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </motion.svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {productPairs.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-gray-800 scale-125 shadow-lg shadow-gray-400/50"
                        : "bg-gray-400/50 hover:bg-gray-500"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white border border-gray-300 rounded-3xl p-12 max-w-md mx-4 shadow-md"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              Sin productos disponibles
            </h3>
            <p className="text-gray-600 font-medium">
              No hay productos disponibles en este momento. Vuelve pronto para
              ver nuestras ofertas especiales.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
