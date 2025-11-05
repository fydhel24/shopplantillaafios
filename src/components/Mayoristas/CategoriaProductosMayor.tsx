import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../prodcucto/ProductCard';
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

interface Categoria {
  id: number;
  categoria: string;
  productos: Producto[];
}

const CategoriaProductosMayor: React.FC = () => {
  const { categoryMayorName } = useParams<{ categoryMayorName: string }>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el texto de búsqueda
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());
  const [fallingImages, setFallingImages] = useState<any[]>([]);

  const fetchProductosPorCategoria = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.importadoramiranda.com/api/lupe/categorias`);
      const categoriaEncontrada = response.data.find((categoria: Categoria) =>
        categoria.categoria.toLowerCase() === categoryMayorName?.toLowerCase()
      );

      if (categoriaEncontrada) {
        setProductos(categoriaEncontrada.productos);
        setFilteredProductos(categoriaEncontrada.productos); // Inicializa productos filtrados
      } else {
        setError(`No se encontraron productos para la categoría: ${categoryMayorName}`);
      }
      setLoading(false);
    } catch (error) {
      setError('No se pudieron cargar los productos de esta categoría.');
      setLoading(false);
    }
  }, [categoryMayorName]);

  useEffect(() => {
    fetchProductosPorCategoria();
  }, [fetchProductosPorCategoria]);

  useEffect(() => {
    const imagesArray = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      size: Math.random() * 80 + 50,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFallingImages(imagesArray);
  }, []);

  useEffect(() => {
    // Filtrar productos según el término de búsqueda
    const filtered = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
  }, [searchTerm, productos]);

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts((prev) => new Set(prev.add(parseInt(entry.target.id))));
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
    return <div className="text-center mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-20 mt-20 relative">
      <div className="falling-background absolute top-0 left-0 right-0 bottom-0 z-[-1]">
        {fallingImages.map((image) => (
          <img
            key={image.id}
            src="/logo.png"
            alt="Logo"
            className="falling-logo"
            style={{
              left: `${image.left}%`,
              width: `${image.size}px`,
              height: `${image.size}px`,
              animationDuration: `${6 + image.delay}s`,
              animationDelay: `${image.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Productos en {categoryMayorName}
        </h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
          className="mt-4 p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
        />
      </div>

      <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productosOrdenados.map((producto: Producto) => (
          <div
            key={producto.id}
            id={String(producto.id)}
            ref={(node) => observer(node!)}
            className={`product-card transition-opacity duration-1000 ${
              visibleProducts.has(producto.id) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ProductMayorCard
              producto={producto}
              index={producto.id}
              cartPosition={{ x: 0, y: 0 }}
            />
          </div>
        ))}
      </div>

      {loading && productos.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <p className="text-lg text-gray-600">Cargando más productos...</p>
        </div>
      )}
    </section>
  );
};

export default CategoriaProductosMayor;
