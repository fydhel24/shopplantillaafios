import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./prodcucto/ProductCard";
import { motion } from "framer-motion";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string;
  stock: number;
  estado: number;
  fecha: string;
  id_cupo: number;
  id_tipo: number;
  id_categoria: number;
  id_marca: number;
  created_at: string;
  updated_at: string;
  precio_extra: string;
  stock_sucursal_1: number;
  categoria: {
    id: number;
    categoria: string;
  };
  marca: {
    id: number;
    marca: string;
  };
  tipo: {
    id: number;
    tipo: string;
  };
  cupo: {
    id: number;
    codigo: string;
    porcentaje: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
  fotos: Array<{
    id: number;
    foto: string;
  }>;
  precio_productos: Array<{
    id: number;
    precio_unitario: string;
    precio_general: string;
    precio_extra: string;
  }>;
}

const CategoriaProductos: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProductosPorCategoria = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.importadoramiranda.com/api/lupe/categorias`
      );
      const categoriaEncontrada = response.data.find(
        (categoria: any) =>
          categoria.categoria.toLowerCase() === categoryName?.toLowerCase()
      );

      if (categoriaEncontrada) {
        setProductos(categoriaEncontrada.productos);
        setFilteredProductos(categoriaEncontrada.productos);
      } else {
        setError(
          `No se encontraron productos para la categoría: ${categoryName}`
        );
      }
      setLoading(false);
    } catch (error) {
      setError("No se pudieron cargar los productos de esta categoría.");
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProductosPorCategoria();
  }, [fetchProductosPorCategoria]);

  useEffect(() => {
    const filteredResults = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProductos(filteredResults);
  }, [searchQuery, productos]);

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts(
            (prev) => new Set(prev.add(parseInt(entry.target.id)))
          );
        }
      });
    });
    if (node) io.observe(node);
  }, []);

  const productosOrdenados = filteredProductos.sort((a, b) => {
    if (a.stock_sucursal_1 === 0 && b.stock_sucursal_1 > 0) return 1;
    if (a.stock_sucursal_1 > 0 && b.stock_sucursal_1 === 0) return -1;
    return 0;
  });

  if (loading && productos.length === 0) {
    return (
      <div className="text-center py-20 text-white bg-gradient-to-br from-red-900 via-red-700 to-gray-800 font-sans">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400 bg-gradient-to-br from-red-900 via-red-700 to-gray-800 font-sans">
        {error}
      </div>
    );
  }

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-red-900 via-red-700 to-gray-800 text-white relative min-h-screen font-sans">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12 mt-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg"
          >
            Productos en {categoryName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-red-300 mt-2 text-lg font-medium"
          >
            Explora los mejores productos disponibles en esta categoría
          </motion.p>
        </header>

        <div className="sticky top-20 z-20 bg-gray-900/80 backdrop-blur-md rounded-full py-2 mb-10 shadow-lg max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              id="search"
              aria-label="Buscar productos"
              placeholder="Busca un producto en esta categoría..."
              className="w-full px-5 py-3 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300 hover:shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center"
        >
          {productosOrdenados.map((producto: Producto) => (
            <motion.div
              key={producto.id}
              id={String(producto.id)}
              ref={(node) => {
                if (node) observer(node);
              }}
              className={`product-card relative rounded-t-lg rounded-b-[40%] shadow-2xl bg-white bg-opacity-5 backdrop-blur-md text-white hover:scale-105 transform transition-transform duration-300 cursor-pointer overflow-hidden border border-gray-700 transition-opacity animate-fade-in`}
              style={{ opacity: visibleProducts.has(producto.id) ? 1 : 0 }}
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)",
              }}
            >
              <ProductCard
                producto={{
                  ...producto,
                  stock: producto.stock ?? 0,
                  precio_extra: producto.precio_extra || producto.precio,
                }}
                index={producto.id}
                cartPosition={{ x: 0, y: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {loading && productos.length > 0 && (
          <div className="flex justify-center items-center py-6">
            <p className="text-lg text-red-300">Cargando más productos...</p>
          </div>
        )}
      </div>
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #ef4444; 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .product-card {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            position: relative;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
    </section>
  );
};

export default CategoriaProductos;
