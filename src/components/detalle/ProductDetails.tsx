import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "../carrito/CarritoContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProductToCart {
  id: number;
  name: string;
  price: number;
  img: string;
}
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string;
  stock: number;
  estado: number;
  categoria: { id: string; categoria: string };
  marca: { id: string; marca: string };
  tipo: { id: string; tipo: string };
  precio_productos: Array<{
    precio_extra: string;
    precio_general: string;
    precio_unitario: string;
  }>;
}
interface Foto {
  identificacion: number;
  foto: string;
}
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  fotos: Foto[];
  imageUrl?: string;
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [product] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const manejarClicImagen = (id: number) => {
    navigate(`/producto/${id}`);
  };

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(
            `https://importadoramiranda.com/api/producto/${productId}`
          );
          if (!response.ok)
            throw new Error("Error al obtener los detalles del producto");
          const data = await response.json();
          setProductDetails(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    if (productDetails?.categoria?.id) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(
            `https://importadoramiranda.com/api/lupe/filtro_categorias?id_categoria=${productDetails.categoria.id}`
          );
          if (!response.ok)
            throw new Error("Error al obtener productos relacionados");
          const data = await response.json();
          if (data.length > 0 && data[0].productos) {
            const filteredProducts = data[0].productos
              .filter((prod: Product) => prod.id !== productDetails.id)
              .map((prod: Product) => ({
                ...prod,
                imageUrl:
                  prod.fotos.length > 0
                    ? `https://importadoramiranda.com/storage/${prod.fotos[0].foto}`
                    : "https://via.placeholder.com/150",
              }));
            setRelatedProducts(filteredProducts);
          } else {
            setRelatedProducts([]);
          }
        } catch (err) {
          console.error("Error cargando productos relacionados:", err);
          setRelatedProducts([]);
        }
      };
      fetchRelatedProducts();
    }
  }, [productDetails]);

  const handleAddToCart = () => {
    if (!productDetails?.fotos?.[0]?.foto) return;

    const precioExtra =
      productDetails.precio_productos?.[0]?.precio_extra ||
      productDetails.precio;

    const productToAdd: ProductToCart = {
      id: parseInt(productDetails.id),
      name: productDetails.nombre,
      price: parseFloat(precioExtra),
      img: `https://importadoramiranda.com/storage/${productDetails.fotos[0].foto}`,
    };

    addToCart(productToAdd);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-xl font-medium text-slate-700"
        >
          Cargando detalles del producto...
        </motion.p>
      </div>
    );

  if (error || !productDetails)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-500 text-lg font-semibold mb-2">
            {error || "No se encontraron detalles del producto"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 font-sans">
      {/* Header con navegación */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Galería de imágenes - Nuevo diseño */}
          <div className="space-y-6">
            <motion.div
              layoutId={`product-image-${selectedImage}`}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {productDetails.fotos?.[selectedImage]?.foto && (
                <img
                  src={`https://importadoramiranda.com/storage/${productDetails.fotos[selectedImage].foto}`}
                  alt={productDetails.nombre}
                  className="w-full h-full object-contain cursor-zoom-in p-4"
                  onClick={() => setShowZoom(true)}
                />
              )}
              {/* Badge de destacado */}
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Destacado
                </span>
              </div>
            </motion.div>

            {/* Miniaturas mejoradas */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              {productDetails.fotos?.map((foto: any, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 relative aspect-square w-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={`https://importadoramiranda.com/storage/${foto.foto}`}
                    alt={`${productDetails.nombre} - Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Información del producto - Rediseñada */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Header del producto */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                    {productDetails.nombre}
                  </h1>

                  {/* Rating y reviews */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= 4
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 text-sm">
                      (128 reviews)
                    </span>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-2xl border transition-all duration-200 ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:border-slate-300 bg-white transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <motion.p className="text-slate-900 text-sm leading-relaxed font-medium bg-slate-50 rounded-2xl p-4 border border-slate-100">
                {productDetails.descripcion}
              </motion.p>
            </div>

            {/* Precio y compra */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-slate-900">
                  Bs.{" "}
                  {productDetails.precio_productos?.[0]?.precio_extra ||
                    productDetails.precio ||
                    "0.00"}
                </span>
                {productDetails.precio_productos?.[0]?.precio_extra && (
                  <span className="text-lg text-slate-400 line-through">
                    Bs.{" "}
                    {(
                      parseFloat(
                        productDetails.precio_productos[0].precio_extra
                      ) + 100
                    ).toFixed(2)}
                  </span>
                )}
                {productDetails.precio_productos?.[0]?.precio_extra && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    ¡Oferta especial!
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Botones de acción */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                      addedToCart
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    }`}
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {addedToCart
                      ? "¡Agregado al Carrito! 🎉"
                      : "Agregar al Carrito"}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Categoría",
                  value: productDetails.categoria?.categoria,
                  icon: "📦",
                },
                {
                  label: "Marca",
                  value: productDetails.marca?.marca,
                  icon: "🏷️",
                },
                {
                  label: "Tipo",
                  value: productDetails.tipo?.tipo,
                  icon: "🔧",
                },
                {
                  label: "Stock Disponible",
                  value: `${productDetails.stock_sucursal_1} unidades`,
                  icon: "📊",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="block font-semibold text-slate-700 text-sm">
                        {item.label}
                      </span>
                      <span className="font-medium text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Productos relacionados - Rediseñado */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Productos Sugeridos
            </h2>
            <p className="text-slate-600 text-lg">
              Descubre productos similares que te pueden interesar
            </p>
          </div>

          <motion.div className="relative" whileTap={{ cursor: "grabbing" }}>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              drag="x"
              dragConstraints={{ left: -1000, right: 0 }}
              dragElastic={0.2}
            >
              {relatedProducts.slice(0, 5).map((prod) => (
                <motion.div
                  key={prod.id}
                  className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  onClick={() => manejarClicImagen(prod.id)}
                  whileHover={{ y: -8 }}
                >
                  <div className="p-3">
                    <img
                      src={prod.imageUrl || "/placeholder.svg"}
                      alt={prod.nombre}
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {prod.nombre}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-900">
                        Bs. {prod.precio}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-slate-600">4.5</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Tarjeta "Ver más" */}
              <motion.div
                className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden cursor-pointer flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (productDetails.categoria?.categoria) {
                    const categoryName = encodeURIComponent(
                      productDetails.categoria.categoria
                    );
                    navigate(`/categorias/${categoryName}`);
                  }
                }}
              >
                <div className="text-white text-center p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ver más</h3>
                  <p className="text-blue-100 font-medium">
                    Descubre más productos
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modal de zoom */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowZoom(false)}
          >
            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              src={`https://importadoramiranda.com/storage/${productDetails.fotos[selectedImage].foto}`}
              alt={productDetails.nombre}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setShowZoom(false)}
            >
              <span className="text-2xl">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
