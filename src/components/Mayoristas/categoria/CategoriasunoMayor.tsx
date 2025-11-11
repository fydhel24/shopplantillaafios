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
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-gray-200/60 to-gray-400/40"
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
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-gray-300/60 to-gray-500/40"
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
      {/* Círculo principal */}
      <motion.div
        className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
        whileHover={{ scale: 1.1, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Anillo exterior */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-gray-300/60"
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

        {/* Contenedor interno */}
        <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-white to-gray-100 backdrop-blur-xl border-2 border-gray-200 shadow-xl">
          {currentProduct ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentProduct.id}-${currentProductIndex}`}
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden border-2 border-gray-300 shadow-md mb-2">
                    <img
                      src={`https://afios.miracode.tech/storage/${currentProduct.fotos[0].foto}`}
                      alt={currentProduct.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-gray-800 text-xs sm:text-sm font-bold text-center leading-tight mb-1 px-2">
                    {currentProduct.nombre.length > 20
                      ? `${currentProduct.nombre.substring(0, 20)}...`
                      : currentProduct.nombre}
                  </h4>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
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
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Sin productos
            </div>
          )}

          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
            {productsWithImages.length}
          </div>

          {productsWithImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {productsWithImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentProductIndex
                      ? "bg-gray-800"
                      : "bg-gray-300/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Efecto pulso */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gray-400/0 group-hover:border-gray-400/40"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(107, 114, 128, 0)",
              "0 0 0 8px rgba(107, 114, 128, 0.15)",
              "0 0 0 0 rgba(107, 114, 128, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <h3 className="text-gray-800 text-sm sm:text-base lg:text-lg font-bold uppercase mb-1">
          {category.categoria}
        </h3>
        <div className="text-gray-500 text-xs font-medium">
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
          "https://afios.miracode.tech/api/lupe/categorias"
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="text-gray-800 text-xl font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Cargando categorías...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl font-bold bg-gray-100 px-8 py-4 rounded-2xl border border-gray-300 shadow">
          {error}
        </div>
      </div>
    );

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-white text-gray-900 relative min-h-screen font-['Inter']">
      <AnimatedBackground />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            className="text-gray-500 font-semibold uppercase text-sm tracking-[0.3em] mb-3"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Descubre Nuestro Catálogo
          </motion.div>
          <motion.h2
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Categorías
          </motion.h2>
        </div>

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

          {totalPages > 1 && (
            <>
              <motion.button
                onClick={prevPage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-full shadow-md border border-gray-300 transition-all duration-300"
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
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-full shadow-md border border-gray-300 transition-all duration-300"
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "bg-gray-800 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <motion.button
            className="bg-cyan-600 hover:bg-cyan-700 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-3"
            onClick={() => (window.location.href = "/categorias")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Explorar Todas las Categorías</span>
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
