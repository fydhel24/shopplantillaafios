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

/* ===== Círculo de categoría con carrusel interno ===== */
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      onClick={onCategoryClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Anillo exterior gris metálico */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-300 shadow-md" />

        {/* Contenedor principal */}
        <div className="absolute inset-2 rounded-full overflow-hidden bg-white border border-gray-200 shadow-lg">
          {currentProduct ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentProduct.id}-${currentProductIndex}`}
                className="flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border border-gray-300 mb-2">
                  <img
                    src={`https://importadoramiranda.com/storage/${currentProduct.fotos[0].foto}`}
                    alt={currentProduct.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-gray-800 text-xs sm:text-sm font-medium text-center px-2">
                  {currentProduct.nombre.length > 22
                    ? `${currentProduct.nombre.substring(0, 22)}...`
                    : currentProduct.nombre}
                </h4>
                <span className="mt-1 bg-cyan-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                
                  Bs.{" "}
                  {currentProduct.precio_extra !== "0.00"
                    ? currentProduct.precio_extra
                    : currentProduct.precio !== "0.00"
                    ? currentProduct.precio
                    : "0"}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Sin productos
            </div>
          )}

          {/* Indicadores de cambio */}
          {productsWithImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {productsWithImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === currentProductIndex
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <h3 className="mt-4 text-gray-900 text-sm sm:text-base font-semibold uppercase tracking-wide">
        {category.categoria}
      </h3>
      <p className="text-gray-500 text-xs">
        {category.productos.length} productos
      </p>
    </motion.div>
  );
};

/* ===== Página principal con carrusel de categorías ===== */
const CategoriasUno: React.FC = () => {
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

  const nextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
  const prevPage = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Cargando categorías...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-600">
        {error}
      </div>
    );

  return (
    <section className="relative min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado formal */}
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-semibold tracking-widest uppercase text-sm mb-2">
            Catálogo Profesional
          </h2>
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tight">
            Categorías de Productos
          </h1>
          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Explora la variedad completa de productos disponibles.
          </p>
        </div>

        {/* Carrusel de categorías */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center"
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

        {/* Navegación lateral */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <button
              onClick={prevPage}
              className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-500 transition-all rounded-md"
            >
              Anterior
            </button>
            <span className="text-gray-500 text-sm">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-500 transition-all rounded-md"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Botón principal */}
        <div className="flex justify-center mt-16">
          <motion.button
            onClick={() => (window.location.href = "/categorias")}
            className="bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400 text-white px-8 py-4 rounded-full font-medium shadow-md"
            
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver todas las categorías
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CategoriasUno;
