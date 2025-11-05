import type React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "./prodcucto/ProductCard";

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

const TodosLosProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const fetchTodosLosProductos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://www.importadoramiranda.com/api/lupe/categorias"
      );
      const productos = response.data.flatMap(
        (categoria: any) => categoria.productos
      );
      setProductos(productos);
      setFilteredProductos(productos);
      setLoading(false);
    } catch (error) {
      setError("No se pudieron cargar los productos.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodosLosProductos();
  }, [fetchTodosLosProductos]);

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts(
            (prev) => new Set(prev.add(Number.parseInt(entry.target.id)))
          );
        }
      });
    });
    if (node) io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredProductos(
      productos
        .filter((producto) =>
          producto.nombre.toLowerCase().includes(lowerCaseQuery)
        )
        .sort((a, b) => {
          if (a.estado === 1 && b.estado !== 1) return -1;
          if (a.estado !== 1 && b.estado === 1) return 1;
          if (a.stock_sucursal_1 > 0 && b.stock_sucursal_1 === 0) return -1;
          if (a.stock_sucursal_1 === 0 && b.stock_sucursal_1 > 0) return 1;
          return 0;
        })
    );
  }, [searchQuery, productos]);

  const showMoreProducts = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 20, filteredProductos.length)
    );
  };

  const showLessProducts = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 20, 20));
  };

  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.querySelector(".sticky");
      if (searchBar) {
        if (window.scrollY > 100) {
          searchBar.classList.add("compact");
        } else {
          searchBar.classList.remove("compact");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading && productos.length === 0) {
    return (
      <div className="text-center py-20 text-white bg-gradient-to-br from-red-900 via-red-700 to-gray-800">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400 bg-gradient-to-br from-red-900 via-red-700 to-gray-800">
        {error}
      </div>
    );
  }

  return (
    <section className="py-10 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-red-900 via-red-700 to-gray-800 text-white relative min-h-screen font-sans">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10 mt-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Todos los productos
          </h2>
          <p className="text-white font-medium tracking-wide flex items-center justify-center space-x-2">
            Explora todos los productos disponibles
          </p>
        </header>

        <div className="relative max-w-xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="flex items-center px-6 py-4">
            <input
              type="text"
              id="search"
              aria-label="Buscar productos"
              placeholder="Busca entre miles de productos..."
              className="flex-1 bg-transparent text-white placeholder-gray-300 text-lg font-light tracking-wide focus:outline-none"
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

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center py-10">
          {filteredProductos
            .slice(0, visibleCount)
            .map((producto: Producto) => (
              <div
                key={producto.id}
                id={String(producto.id)}
                ref={(node) => {
                  if (node) observer(node);
                }}
                className={`product-card rounded-full aspect-square w-full max-w-[200px] shadow-2xl bg-gray-900 text-white hover:scale-105 transform transition-transform duration-300 cursor-pointer overflow-hidden border border-red-700 transition-opacity animate-fade-in`}
                style={{ opacity: visibleProducts.has(producto.id) ? 1 : 0 }}
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
              </div>
            ))}
        </section>

        <div className="flex justify-center items-center py-6 space-x-4">
          {visibleCount < filteredProductos.length && (
            <button
              onClick={showMoreProducts}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors ease-in-out duration-300 transform hover:scale-105 shadow-lg font-bold"
            >
              Ver más
            </button>
          )}
          {visibleCount > 20 && (
            <button
              onClick={showLessProducts}
              className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors ease-in-out duration-300 transform hover:scale-105 shadow-lg font-bold"
            >
              Ver menos
            </button>
          )}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #ef4444; /* Color de la barra de desplazamiento */
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .sticky.compact {
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          transition: padding 0.3s ease-in-out;
        }
        .product-card {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            position: relative;
        }
        /* Animación de entrada */
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

export default TodosLosProductos;
