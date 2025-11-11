import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
  categoria: { id: number; categoria: string };
  marca: { id: number; marca: string };
  tipo: { id: number; tipo: string };
  cupo: {
    id: number;
    codigo: string;
    porcentaje: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
  fotos: Array<{ id: number; foto: string }>;
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
        `https://afios.miracode.tech/api/lupe/categorias`
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
      <div className="text-center py-20 text-black bg-white font-sans">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 bg-white font-sans">
        {error}
      </div>
    );
  }

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 bg-white text-black relative min-h-screen font-sans">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12 mt-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Productos en {categoryName}
          </h2>
          <p className="text-gray-700 mt-2 text-lg font-medium">
            Explora los mejores productos disponibles en esta categoría
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {productosOrdenados.map((producto: Producto) => (
            <div
              key={producto.id}
              id={String(producto.id)}
              ref={(node) => {
                if (node) observer(node);
              }}
              className="product-card relative rounded-lg shadow-md bg-white border border-gray-200 cursor-pointer overflow-hidden p-4 flex flex-col items-center"
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
        </div>

        {loading && productos.length > 0 && (
          <div className="flex justify-center items-center py-6">
            <p className="text-lg text-gray-700">Cargando más productos...</p>
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        .product-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
          position: relative;
          border-radius: 12px;
        }
      `}</style>
    </section>
  );
};

export default CategoriaProductos;
