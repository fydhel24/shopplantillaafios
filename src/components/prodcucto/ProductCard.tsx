import React, { useCallback, useState } from "react";
import { useCart } from "../carrito/CarritoContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

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

interface ProductCardProps {
  producto: Producto;
  index: number;
  cartPosition: { x: number; y: number };
  isFeatured?: boolean;
  showStar?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  index,
  cartPosition,
  isFeatured = false,
  showStar = false,
  
}) => {
  const navigate = useNavigate();
  const { addToCart, incrementQuantity, removeFromCart, cartItems } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const isInCart = useCallback((id: number) => cartItems.some((item) => item.id === id), [cartItems]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (producto.stock_sucursal_1 === 0 || isAnimating) return;

    setIsAnimating(true);

    if (!isInCart(producto.id)) {
      addToCart({
        id: producto.id,
        name: producto.nombre,
        price: Number.parseFloat(producto.precio_extra ),
        img: producto.fotos[0]?.foto
          ? `https://afios.miracode.tech/storage/${producto.fotos[0].foto}`
          : "/placeholder.jpg",
      });
    } else {
      incrementQuantity(producto.id);
    }

    setIsAnimating(false);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart(producto.id)) {
      removeFromCart(producto.id);
    }
    console.log("Producto ID:", producto.id);  // Esto mostrará el ID en la consola
  navigate(`/producto/${producto.id}`);
  };

  const handleNavigateToDetails = () => {
    navigate(`/producto/${producto.id}`);
  };
  
  const getBackgroundColor = () => {
    if (producto.stock_sucursal_1 === 0) return 'bg-red-600 bg-opacity-90';
    if (isInCart(producto.id)) return 'bg-green-500 bg-opacity-90';
    return 'bg-white hover:bg-opacity-95';
  };

  const getStockStatus = () => {
    if (producto.stock_sucursal_1 === 0) {
      return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
          <span className="text-white text-xl font-bold py-2 px-4 bg-black bg-opacity-75 rounded-lg">
            AGOTADO
          </span>
        </div>
      );
       
    }
    if (isInCart(producto.id)) {
      return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <span className="text-white text-xl font-bold">¡EN CARRITO!</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`mb-4 ${producto.estado === 1 ? "order-first" : ""}`}>
      <div
        className={`card-container relative rounded-lg overflow-visible shadow-lg hover:shadow-2xl transition-all duration-300 m-2 w-full max-w-[300px] sm:max-w-[260px] md:max-w-[220px] lg:max-w-[200px] cursor-pointer ${getBackgroundColor()}`}
        onClick={handleNavigateToDetails}
      >
        {producto.estado === 1 && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              zIndex: 30,
              transform: "rotate(20deg)",
              color: "#efb810",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27z"
              />
            </svg>
          </div>
        )}

        {getStockStatus()}

        <div className="relative">
          <Carousel 
            showThumbs={false} 
            autoPlay 
            infiniteLoop 
            className="rounded-lg z-0"
            showStatus={false}
            interval={5000}
          >
            {producto.fotos.map((foto) => (
              <div key={foto.id}>
                <img
                  src={`https://afios.miracode.tech/storage/${foto.foto}`}
                  alt={producto.nombre}
                  className="w-80 h-48 object-cover"
                />
              </div>
            ))}
          </Carousel>

          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
            {/* <h3 className="text-sm font-medium line-clamp-2">{producto.nombre}</h3> */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-lg font-bold">
                Bs. {producto.precio_extra || producto.precio}
              </span>
              {parseFloat(producto.precio) > parseFloat(producto.precio_extra || producto.precio) && (
                <span className="text-sm line-through text-gray-300">
                  Bs. {producto.precio}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button
            onClick={(e) => handleAddToCart(e)}
            disabled={producto.stock_sucursal_1 === 0}
            className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
              producto.stock_sucursal_1 === 0 
                ? "bg-cyan-700 cursor-not-allowed opacity-50" 
                : isInCart(producto.id)
                ? "bg-green-600"
                : "bg-cyan-600 hover:bg-blue-700"
            }`}
          >
            <i className="fas fa-shopping-cart text-white text-xl"></i>
          </button>

          {isInCart(producto.id) && (
            <button
              onClick={(e) => handleRemoveFromCart(e)}
              className="p-4 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition-all transform hover:scale-105"
            >
              ✖
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;