"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  nombre: string;
  precio_extra: string;
  fotos: {
    id: number;
    foto: string;
  }[];
}

interface Category {
  id: number;
  categoria: string;
  productos: Product[];
}

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/3 -top-1/3 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-gray-300/15 to-gray-400/10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -left-1/3 -bottom-1/3 w-2/3 h-2/3 rounded-full bg-gradient-to-tr from-gray-400/12 to-gray-500/15"
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [0, -40, 0],
          y: [0, 40, 0],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-white/5 to-gray-300/8"
        animate={{
          scale: [0.8, 1.3, 0.8],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
};

const SearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => {
  return (
    <motion.div
      className="sticky top-24 z-50 mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="flex items-center px-6 py-4">
            <motion.svg
              className="w-6 h-6 text-gray-500 mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </motion.svg>
            <input
              type="text"
              placeholder="Buscar tu categoría favorita..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex-1 bg-transparent text-black placeholder-gray-400 text-lg font-medium tracking-wide focus:outline-none"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery("")}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.slice(0, 4).map((product, index) => (
        <motion.div
          key={product.id}
          className="group relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            {product.fotos.length > 0 ? (
              <img
                src={`https://importadoramiranda.com/storage/${product.fotos[0].foto}`}
                alt={product.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div className="absolute bottom-2 right-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
              Bs.{product.precio_extra}
            </div>
          </div>

          <h4 className="mt-2 text-sm text-black font-medium truncate">
            {product.nombre}
          </h4>
        </motion.div>
      ))}
    </div>
  );
};

const CategoryCard: React.FC<{
  category: Category;
  index: number;
  onClick: () => void;
}> = ({ category, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <motion.div
          className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden p-6 flex flex-col min-h-[450px]"
          whileHover={{
            y: -5,
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
        >
          <div className="relative mb-6 text-center">
            <h2 className="text-2xl font-semibold text-black tracking-tight">
              {category.categoria}
            </h2>
            <div className="text-gray-600 text-sm mt-1">
              {category.productos.length} productos disponibles
            </div>
          </div>

          <div className="flex-1 mb-6">
            <ProductGrid products={category.productos} />
          </div>

          <div className="text-center">
            <motion.button
              className="bg-black text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <span>Explorar Colección</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Categorias: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://importadoramiranda.com/api/lupe/categorias"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category: Category) => {
    navigate(`/categorias/${category.categoria}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-black text-xl font-medium">
            Cargando categorías...
          </div>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="text-center bg-white rounded-3xl p-12 border border-gray-200 shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-black text-xl font-medium mb-2">{error}</div>
          <div className="text-gray-600 text-sm">
            Intenta recargar la página
          </div>
        </motion.div>
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 text-black relative font-['Inter',_sans-serif]">
      <AnimatedBackground />

      <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
        <header className="text-center mb-10 mt-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Nuestras Categorías
          </h2>
          <p className="text-gray-700 font-medium tracking-wide mt-2">
            Descubre nuestra amplia gama de productos organizados en categorías
            especialmente para ti
          </p>
        </header>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <AnimatePresence>
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12"
            layout
          >
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCategories.length === 0 && searchQuery && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-md max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-xl font-medium text-black mb-2">
                No encontramos resultados
              </h3>
              <p className="text-gray-600 text-sm">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Categorias;
