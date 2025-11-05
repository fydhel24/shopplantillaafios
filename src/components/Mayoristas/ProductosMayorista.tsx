import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductMayorCard from './productomayor/ProductMayorCard';



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
    cantidad: string;
  }>;
}

const ProductosMayorista: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const fetchProductosMayorista = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://www.importadoramiranda.com/api/lupe/categorias');
      const productos = response.data.flatMap((categoria: any) => categoria.productos);
      setProductos(productos);
      setFilteredProductos(productos);
      setLoading(false);
    } catch (error) {
      setError('No se pudieron cargar los productos.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductosMayorista();
  }, [fetchProductosMayorista]);

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts((prev) => new Set(prev.add(parseInt(entry.target.id))));
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
          if ((a.stock_sucursal_1 > 0 && b.stock_sucursal_1 === 0)) return -1;
          if ((a.stock_sucursal_1 === 0 && b.stock_sucursal_1 > 0)) return 1;
          return 0;
        })
    );
  }, [searchQuery, productos]);

  const showMoreProducts = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 20, filteredProductos.length));
  };

  const showLessProducts = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 20, 20));
  };

  if (loading && productos.length === 0) {
    return <div className="text-center mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-20 mt-20">
      {/* Mover Posicion */}
      <div className="container mx-auto px-4 text-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
         PRODUCTOS MAYORISTAS
        </h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredProductos.slice(0, visibleCount).map((producto: Producto) => (
          <div
            key={producto.id}
            id={String(producto.id)}
            ref={(node) => {
              if (node) observer(node);
            }}
            className={`product-card transition-opacity duration-1000 ${
              visibleProducts.has(producto.id) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ProductMayorCard
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

      <div className="flex justify-center items-center py-4">
        {visibleCount < filteredProductos.length && (
          <button
            onClick={showMoreProducts}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Ver más
          </button>
        )}
        {visibleCount > 20 && (
          <button
            onClick={showLessProducts}
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Ver menos
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductosMayorista;
