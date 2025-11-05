"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nombre: string;
  precio: string;
  precio_extra: string;
  fotos: { id: number; foto: string }[];
}

interface Category {
  id: number;
  categoria: string;
  productos: Product[];
}

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-red-400/20 to-gray-600/15"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
          rotate: [0, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-red-600/18 to-gray-500/20"
        animate={{
          scale: [1.2, 0.8, 1.2],
          x: [0, -35, 0],
          y: [0, 35, 0],
          rotate: [0, -60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const CategoryCircle: React.FC<{
  category: Category;
  index: number;
  onCategoryClick: () => void;
}> = ({ category, index, onCategoryClick }) => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const productsWithImages = category.productos.filter(
    (p) => p.fotos.length > 0
  );

  // Cambiar producto automáticamente cada 3 segundos
  useEffect(() => {
    if (productsWithImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % productsWithImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [productsWithImages.length]);

  const currentProduct = productsWithImages[currentProductIndex];

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      onClick={onCategoryClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Círculo principal de la categoría */}
      <motion.div
        className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
        whileHover={{ scale: 1.1, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Anillo exterior animado */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-400/60"
          animate={{
            rotate: 360,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: { duration: 0.3 },
          }}
        />

        {/* Círculo de contenido */}
        <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-white/15 to-gray-500/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Producto dentro del círculo */}
          {currentProduct ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentProduct.id}-${currentProductIndex}`}
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Imagen del producto */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-lg mb-2">
                    <img
                      src={`https://importadoramiranda.com/storage/${currentProduct.fotos[0].foto}`}
                      alt={currentProduct.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nombre del producto */}
                  <h4 className="text-white text-xs sm:text-sm font-medium text-center leading-tight mb-1 px-2">
                    {currentProduct.nombre.length > 20
                      ? `${currentProduct.nombre.substring(0, 20)}...`
                      : currentProduct.nombre}
                  </h4>

                  {/* Precio */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Bs.
                    {currentProduct.precio_extra !== "0.00"
                      ? currentProduct.precio_extra
                      : currentProduct.precio !== "0.00"
                      ? currentProduct.precio
                      : "0"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            // Sin productos
            <div className="flex items-center justify-center h-full text-white/70 text-sm">
              Sin productos
            </div>
          )}

          {/* Indicador de cantidad de productos */}
          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
            {productsWithImages.length}
          </div>

          {/* Indicadores de progreso */}
          {productsWithImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {productsWithImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentProductIndex
                      ? "bg-red-400 shadow-lg"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Efecto de pulso */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400/0 group-hover:border-red-400/30"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0)",
              "0 0 0 8px rgba(239, 68, 68, 0.1)",
              "0 0 0 0 rgba(239, 68, 68, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      {/* Nombre de la categoría */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <h3 className="text-white text-sm sm:text-base lg:text-lg font-medium tracking-wide uppercase mb-1">
          {category.categoria}
        </h3>
        <div className="text-red-300 text-xs font-light">
          {category.productos.length} productos
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoriasUnoMayor: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://importadoramiranda.com/api/lupe/categorias"
        );
        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    navigate(`/categorias/${category.categoria}`);
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const currentCategories = categories.slice(
    currentPage * categoriesPerPage,
    (currentPage + 1) * categoriesPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-white text-xl font-light"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Cargando categorías...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-gray-800 flex items-center justify-center">
        <div className="text-red-300 text-xl font-light bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
          {error}
        </div>
      </div>
    );

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-red-900 via-red-700 to-gray-800 text-white relative min-h-screen font-['Inter',_'SF_Pro_Display',_system-ui,_sans-serif]">
      <AnimatedBackground />

      {/* Overlays para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/15 via-transparent to-gray-800/15"></div>

      <div className="container mx-auto relative z-10">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <motion.div
            className="text-red-300 font-medium uppercase text-sm tracking-[0.3em] mb-4 font-mono"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Descubre Nuestro Catálogo
          </motion.div>
          <motion.h2
            className="text-4xl md:text-6xl font-light tracking-tight leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Categorias
            
          </motion.h2>
        </div>

        {/* Fila de círculos de categorías */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-4 xl:gap-6 justify-items-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              {currentCategories.map((category, index) => (
                <CategoryCircle
                  key={category.id}
                  category={category}
                  index={index}
                  onCategoryClick={() => handleCategoryClick(category)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Controles de navegación lateral */}
          {totalPages > 1 && (
            <>
              <motion.button
                onClick={prevPage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full shadow-lg border border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6"
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
                onClick={nextPage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full shadow-lg border border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6"
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
            </>
          )}
        </div>

        {/* Indicadores de página */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "bg-red-400 shadow-lg shadow-red-400/30"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}

        {/* Botón para ver más */}
        <div className="flex justify-center mt-16">
          <motion.button
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-medium shadow-xl transition-all duration-300 border border-white/20 flex items-center space-x-3"
            onClick={() => (window.location.href = "/categorias")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="tracking-wide">Explorar Todas las Categorías</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CategoriasUnoMayor;
