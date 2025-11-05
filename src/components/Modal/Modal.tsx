import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import { useCart } from '../carrito/CarritoContext';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio_extra: string;
    fotos: { id: number; foto: string }[];
    stock_sucursal_1: number;
    categoria: { id: number; categoria: string };
  };
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string | null;
  stock: number;
  fotos: { id: number; foto: string }[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, producto }) => {
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();  // Inicializa el hook de navegación

  useEffect(() => {
    const fetchSugerencias = async () => {
      if (isOpen && producto?.categoria?.id) {
        try {
          const response = await axios.get(
            `https://importadoramiranda.com/api/lupe/filtro_categorias?id_categoria=${producto.categoria.id}`
          );
          if (response.data?.length > 0 && response.data[0]?.productos) {
            setSugerencias(response.data[0].productos);
            setError(null);
          } else {
            setError("No se encontraron productos en esta categoría.");
          }
        } catch {
          setError("No se pudieron cargar las sugerencias. Intenta nuevamente.");
        }
      }
    };

    fetchSugerencias();
  }, [isOpen, producto?.categoria?.id]);

  const handleAddToCart = () => {
    addToCart({
      id: producto.id,
      name: producto.nombre,
      price: parseFloat(producto.precio_extra),
      img: producto.fotos[0]?.foto
        ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}`
        : "/placeholder.jpg",
    });
    setAddedToCart(true);
  };

  // Función para redirigir a la categoría del producto
  const handleVerMas = () => {
    navigate(`/categorias/${producto.categoria.categoria}`);  // Redirige a la ruta de la categoría correspondiente
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
  onClick={onClose}
  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-50 p-2 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>


        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Carousel */}
          <div className="md:w-1/2">
            <Carousel showThumbs={false} autoPlay infiniteLoop className="rounded-lg">
              {producto.fotos.map((foto) => (
                <div key={foto.id}>
                  <img
                    src={`https://importadoramiranda.com/storage/${foto.foto}`}
                    alt={producto.nombre}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-2xl font-bold mb-4">{producto?.nombre}</h2>
            <p className="text-gray-700 mb-4">
              {expanded
                ? producto?.descripcion
                : `${producto?.descripcion.slice(0, 100)}...`}
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 ml-2"
              >
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            </p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-semibold">Precio: Bs{producto?.precio_extra}</p>
              <p
                className={`text-lg font-medium ${producto?.stock_sucursal_1 > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {producto?.stock_sucursal_1 > 0
                  ? `Stock: ${producto.stock_sucursal_1}`
                  : "Agotado"}
              </p>
              {producto.stock_sucursal_1 > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className={`px-6 py-2 rounded-lg transition ${
                    addedToCart
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={addedToCart}
                >
                  {addedToCart ? "Agregado" : "Agregar al carrito"}
                </button>
              ) : (
                <button
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Sin stock
                </button>
              )}
            </div>
            {/* Suggested Products */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Productos que te puedan interesar</h3>
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="flex space-x-4 overflow-x-auto">
                  {sugerencias.slice(0, 5).map((sugerencia) => (
                    <div
                      key={sugerencia.id}
                      className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow hover:shadow-lg transition duration-300"
                    >
                      {sugerencia.fotos.length > 0 && (
                        <img
                          src={`https://importadoramiranda.com/storage/${sugerencia.fotos[0].foto}`}
                          alt={sugerencia.nombre}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      <p className="text-center text-xs mt-2 text-gray-700">{sugerencia.nombre}</p>
                    </div>
                  ))}
                  {sugerencias.length > 5 && (
                    <div className="flex-shrink-0 w-40 flex items-center justify-center">
                      <button
                        onClick={handleVerMas}  // Redirige al hacer clic en "Ver más"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver más...
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
