import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const HeaderMayorista = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white shadow-md border-b border-gray-200"
    >
      <div className="container mx-auto px-6 py-4 md:py-5 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-4"
        >
          <Link to="/main" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Miracode Logo"
              className="h-10 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">
                Miracode Technology
              </h1>
            </div>
          </Link>
        </motion.div>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { path: "/main", label: "Inicio" },
            { path: "/categoriamayor", label: "Categorías" },
            { path: "/productosmayoristas", label: "Productos" },
          ].map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className={`relative group px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentPath === item.path
                    ? "text-black bg-gray-100 font-semibold shadow-sm border border-gray-300"
                    : "text-gray-700 hover:text-black hover:bg-gray-50"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-1 left-1/2 h-0.5 bg-black transform -translate-x-1/2 transition-all duration-300 ${
                    currentPath === item.path
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Usuario (opcional) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
        </div>

        {/* Botón menú móvil */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-inner overflow-hidden"
          >
            <div className="px-4 py-2">
              {[
                { path: "/main", label: "Inicio" },
                { path: "/categoriamayor", label: "Categorías" },
                { path: "/productosmayoristas", label: "Productos" },
              ].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-5 py-3 rounded-md my-1 text-sm font-medium transition-all duration-300 ${
                      currentPath === item.path
                        ? "bg-gray-100 text-black font-semibold border-l-4 border-gray-400"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black hover:translate-x-1"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Info usuario móvil */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3 px-5"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Mayorista</p>
                  <p className="text-xs text-gray-500">Portal Exclusivo</p>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HeaderMayorista;
