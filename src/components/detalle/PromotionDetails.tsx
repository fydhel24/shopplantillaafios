import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../carrito/CarritoContext';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  fotos: string[];
  cantidad?: number;
}

interface Promotion {
  id: number;
  nombre: string;
  descripcion: string;
  precio_promocion: string;
  fotos: string[];
  productos: Product[];
  fecha_inicio: string;
  fecha_fin: string;
  sucursal: {
    nombre: string;
    direccion: string;
  };
}

const PromotionDetails = () => {
  const { promotionId } = useParams<{ promotionId: string }>();
  const { addToCart, cartItems } = useCart();
  const [promotionDetails, setPromotionDetails] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const response = await fetch(`https://importadoramiranda.com/api/promociones/${promotionId}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la promoción');
        const data = await response.json();
        setPromotionDetails(data.promocion);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchPromotionDetails();
    }
  }, [promotionId]);

  const handleAddToCart = () => {
    if (!promotionDetails) return;

    const cartItemsToAdd = promotionDetails.productos.map(producto => ({
      id: producto.id,
      name: producto.nombre,
      price: Number.parseFloat(promotionDetails.precio_promocion),
      img: producto.fotos[0]
        ? `https://importadoramiranda.com/storage/${producto.fotos[0]}`
        : "/placeholder.jpg",
      isPromotion: true,
      promotionDetails: {
        name: promotionDetails.nombre,
        description: `Incluye: ${producto.nombre}`,
        idProducto: producto.id,
      }
    }));

    cartItemsToAdd.forEach(item => addToCart(item));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isInCart = (promotionId: number) => cartItems.some(item => item.id === promotionId);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    arrows: true,
    prevArrow: <ChevronLeft className="text-cyan-300 w-8 h-8" />,
    nextArrow: <ChevronRight className="text-cyan-300 w-8 h-8" />
  };

  if (loading) return (
    <div className="text-center py-20 text-white bg-gradient-to-br from-blue-900 via-sky-800 to-emerald-700 font-sans text-2xl font-semibold min-h-screen flex items-center justify-center">
      Cargando detalles de la promoción...
    </div>
  );

  if (error || !promotionDetails) return (
    <div className="text-center py-20 text-red-400 bg-gradient-to-br from-blue-900 via-sky-800 to-emerald-700 font-sans text-2xl font-semibold min-h-screen flex items-center justify-center">
      {error || 'No se encontraron detalles de la promoción'}
    </div>
  );

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-blue-900 via-sky-800 to-emerald-700 text-white font-sans min-h-screen">
      <div className="container mx-auto max-w-7xl mt-[50px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Galería */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden">
            <Slider {...sliderSettings} className="rounded-lg overflow-hidden">
              {promotionDetails.productos.flatMap(producto =>
                producto.fotos.map((foto, index) => (
                  <div key={index} className="aspect-square">
                    <motion.img
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      src={`https://importadoramiranda.com/storage/${foto}`}
                      alt={`${producto.nombre} - Vista ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))
              )}
            </Slider>
          </div>

          {/* Información */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              {promotionDetails.nombre}
            </h1>

            {promotionDetails.descripcion && (
              <p className="text-cyan-300 text-lg font-medium leading-relaxed">
                {promotionDetails.descripcion}
              </p>
            )}

            <p className="text-3xl font-bold mt-4 mb-6 drop-shadow">
              <span className="bg-cyan-600 bg-opacity-90 text-white px-4 py-2 rounded-full shadow-md">
                Bs {promotionDetails.precio_promocion}
              </span>
            </p>

            {promotionDetails.fecha_fin && (
              <div className="flex items-center gap-2 text-cyan-300 mb-6">
                <Clock className="w-5 h-5" />
                <span>Válido hasta: {new Date(promotionDetails.fecha_fin).toLocaleDateString()}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  addedToCart
                    ? 'bg-green-500 focus:ring-green-400 text-white'
                    : isInCart(promotionDetails.id)
                    ? 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-600 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400 text-white'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? '¡Añadido!' : isInCart(promotionDetails.id) ? 'En el Carrito' : 'Agregar al Carrito'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-md bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                Comprar Ahora
              </motion.button>
            </div>

            {/* Detalles de la sucursal */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 drop-shadow">
                Detalles de la Promoción
              </h3>
              <ul className="space-y-3 text-cyan-300">
                <li>
                  <strong>Sucursal:</strong> {promotionDetails.sucursal.nombre} - {promotionDetails.sucursal.direccion}
                </li>
              </ul>
            </div>

            {/* Productos incluidos */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 drop-shadow">
                Productos Incluidos
              </h3>
              <div className="space-y-4">
                {promotionDetails.productos.map((producto, index) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer"
                  >
                    <img
                      src={producto.fotos[0] ? `https://importadoramiranda.com/storage/${producto.fotos[0]}` : "/placeholder.jpg"}
                      alt={producto.nombre}
                      className="w-20 h-20 object-cover rounded-md shadow-md"
                    />
                    <div>
                      <p className="font-semibold text-white">{producto.nombre}</p>
                      <p className="text-cyan-300 text-sm">{producto.descripcion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionDetails;
