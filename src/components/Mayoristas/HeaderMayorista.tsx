import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const HeaderMayorista = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Estado para el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 shadow-xl bg-gradient-to-br from-red-900 via-red-700 to-gray-800"
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-6 py-4 md:py-6 flex items-center justify-between relative z-10">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-4"
        >
          <Link to="/main" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
              <img
                src="/logo.png"
                alt="Importadora Miranda"
                className="h-12 w-auto relative z-10 drop-shadow-lg"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white drop-shadow-sm">
                Importadora Miranda
              </h1>
              <p className="text-sm text-red-200/90 font-medium">
                Productos de calidad
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Navegación en desktop */}
        <nav className="hidden md:flex items-center space-x-2">
          {[
            { path: "/main", label: "Inicio" },
            { path: "/categoriamayor", label: "Categorías" },
            { path: "/productosmayoristas", label: "Productos" },
          ].map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className={`relative group px-6 py-3 rounded-xl transition-all duration-300 ${
                  currentPath === item.path
                    ? "text-white font-semibold bg-white/20 shadow-lg backdrop-blur-sm"
                    : "text-red-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                
                {/* Animated underline */}
                <span
                  className={`absolute bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-red-300 to-red-400 transform -translate-x-1/2 transition-all duration-300 ${
                    currentPath === item.path
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                />
                
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User section (optional) - can be uncommented if needed */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
        </div>

        {/* Botón del menú móvil */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          aria-label="Toggle menu"
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
            className="md:hidden text-white overflow-hidden bg-gradient-to-b from-red-800/90 to-gray-800/90 backdrop-blur-md border-t border-white/10"
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
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-6 py-4 rounded-lg my-2 transition-all duration-300 ${
                      currentPath === item.path
                        ? "bg-white/20 font-semibold text-white shadow-lg backdrop-blur-sm border-l-4 border-red-400"
                        : "hover:bg-white/10 text-red-100 hover:text-white hover:translate-x-2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {currentPath === item.path && (
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile user info */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-4 border-t border-white/10"
              >
                <div className="flex items-center gap-3 px-6 py-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Mayorista</p>
                    <p className="text-red-200/70 text-xs">Portal Exclusivo</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-50"></div>
    </motion.header>
  );
};

export default HeaderMayorista;