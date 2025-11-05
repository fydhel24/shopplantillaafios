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

export function AnimatedCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-cyan-300/20 to-indigo-400/20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-emerald-300/20 to-teal-400/20"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 30, 0],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const availableProducts = products.filter((product) => product.stock > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (availableProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availableProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [availableProducts.length]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + availableProducts.length) % availableProducts.length
      );
    } else if (info.offset.x < -100) {
      setCurrentIndex((prev) => (prev + 1) % availableProducts.length);
    }
  };

  const handleAddToCart = () => {
    const product = availableProducts[currentIndex];
    addToCart({
      id: product.id,
      name: product.nombre,
      price: Number.parseFloat(product.precio_extra),
      img: product.imageUrl || "/placeholder.jpg",
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-sky-700 to-emerald-600 overflow-hidden pt-16 pb-12 mt-[2.5cm] h-auto">
      <AnimatedCircles />
      {availableProducts.length > 0 ? (
        <div
          ref={containerRef}
          className="relative h-full container mx-auto px-6 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={containerRef}
              onDragEnd={handleDragEnd}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full"
            >
              <div className="text-white space-y-4 md:space-y-6 font-serif order-2 md:order-1">
                <motion.div className="text-emerald-300 font-semibold uppercase text-xs md:text-sm tracking-wider">
                  Oferta Especial
                </motion.div>
                <motion.h1 className="text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-lg">
                  {availableProducts[currentIndex].nombre}
                </motion.h1>
                <motion.p className="text-slate-200 text-base md:text-lg max-w-xl font-light leading-relaxed">
                  {availableProducts[currentIndex].descripcion
                    .split("\r\n")
                    .slice(0, 2)
                    .join(" ")}
                </motion.p>
                <motion.div className="flex justify-center md:justify-start">
                  <button
                    onClick={handleAddToCart}
                    className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-md font-semibold shadow-xl transition-all border border-white/20"
                  >
                    Comprar ahora -{" "}
                    <span className="font-bold text-white ml-1">
                      Bs.{availableProducts[currentIndex].precio_extra}
                    </span>
                  </button>
                </motion.div>
              </div>
              <motion.div className="relative aspect-square order-1 md:order-2 mb-4 md:mb-0">
                <img
                  src={
                    availableProducts[currentIndex].imageUrl ||
                    "/placeholder.svg"
                  }
                  alt={availableProducts[currentIndex].nombre}
                  className="object-cover w-full h-full mx-auto rounded-xl shadow-2xl border-4 border-white/10"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-white text-lg">
          No hay productos disponibles en este momento.
        </p>
      )}
    </div>
  );
}
