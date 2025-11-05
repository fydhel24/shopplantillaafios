import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './prodcucto/ProductCard';

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
interface ProductosProps {
  mostrarDestacados?: boolean;
  productosPorPagina?: number;
  productosPorFilaMobile?: number; // Parámetro para controlar el número de columnas en pantallas pequeñas
  

}

const Productos: React.FC<ProductosProps> = ({ mostrarDestacados = false, productosPorPagina = 6, productosPorFilaMobile = 2 }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('https://importadoramiranda.com/api/lupe/categorias');

        const todosLosProductos: Producto[] = response.data.flatMap((categoria: any) =>
          categoria.productos.map((producto: any) => ({
            ...producto,
            tipo: producto.tipo || { id: 0, tipo: 'normal' },
          }))
        );

        const productosFiltrados = mostrarDestacados
          ? todosLosProductos.filter((producto: Producto) => producto.tipo?.tipo.trim().toLowerCase() === 'nuevo')
          : todosLosProductos;

        setProductos(productosFiltrados);
        setLoading(false);
      } catch (error) {
        setError('No se pudieron cargar los productos.');
        setLoading(false);
      }
    };

    fetchProductos();
  }, [mostrarDestacados]);

  useEffect(() => {
    const updateCartPosition = () => {
      const cartIcon = document.querySelector('.fixed.bottom-4.right-4');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setCartPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };

    updateCartPosition();
    window.addEventListener('resize', updateCartPosition);

    return () => window.removeEventListener('resize', updateCartPosition);
  }, []);

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceInicio + productosPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div>
    <div className={`container mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20`}>
        {productosPaginados.map((producto: Producto, index) => (
          <ProductCard 
            key={producto.id} 
            producto={producto} 
            index={index} 
            cartPosition={cartPosition}
          />
        ))}
      </div>


      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span className="text-lg font-medium">
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Productos;
