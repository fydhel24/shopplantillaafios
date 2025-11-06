import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "./carrito/CarritoContext";
import { useNavigate } from "react-router-dom";

type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
  fotos: string[];
};

type Promocion = {
  id: number;
  nombre: string;
  precio_promocion: string;
  productos: Producto[];
};

const Promociones: React.FC = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await axios.get(
          "https://importadoramiranda.com/api/promociones"
        );
        setPromociones(response.data.promociones);
      } catch (err) {
        setError("Error al cargar las promociones.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromociones();
  }, []);

  const handleComprar = (promocion: Promocion) => {
    const cartItemsToAdd = promocion.productos.map((producto) => {
      return {
        id: producto.id,
        name: `${promocion.nombre} - ${producto.nombre}`,
        price: Number.parseFloat(promocion.precio_promocion),
        img: producto.fotos[0]
          ? `https://importadoramiranda.com/storage/${producto.fotos[0]}`
          : "/placeholder.jpg",
      };
    });

    cartItemsToAdd.forEach((cartItem) => {
      const existingItem = cartItems.find((item) => item.id === cartItem.id);
      if (existingItem) {
        removeFromCart(cartItem.id);
      } else {
        addToCart(cartItem);
      }
    });
  };

  const isInCart = (promocionId: number) =>
    cartItems.some((item) => item.id === promocionId);

  const navigateToDetails = (promocion: Promocion) => {
    navigate(`/promocion/${promocion.id}`);
  };

  if (loading)
    return (
      <div className="text-center py-20 text-black bg-white font-sans text-2xl font-semibold">
        Cargando promociones...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-600 bg-white font-sans text-2xl font-semibold">
        {error}
      </div>
    );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 bg-white text-black font-sans min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10 mt-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Promociones Especiales
          </h1>
          <p className="text-gray-700 mt-2 text-lg font-medium">
            Descubre nuestras promociones exclusivas
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {promociones.map((promocion) => {
            const uniqueImages = Array.from(
              new Set(
                promocion.productos.map((producto) =>
                  producto.fotos.length > 0
                    ? `https://importadoramiranda.com/storage/${producto.fotos[0]}`
                    : null
                )
              )
            ).filter((image) => image !== null);

            return (
              <div
                key={promocion.id}
                className="rounded-lg shadow-md bg-white border border-gray-200 cursor-pointer overflow-hidden"
                onClick={() => navigateToDetails(promocion)}
              >
                <div className="p-4 flex flex-col justify-between h-full">
                  <h2
                    className="text-lg font-semibold mb-3 text-center text-black px-3 py-2"
                    style={{
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3rem",
                    }}
                  >
                    {promocion.nombre}
                  </h2>

                  <div className="flex-grow mb-3">
                    {uniqueImages.length === 1 ? (
                      <img
                        src={uniqueImages[0] || "/placeholder.svg"}
                        alt={`Imagen promoción ${promocion.nombre}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <Slider
                        {...settings}
                        className="h-48 rounded-lg overflow-hidden"
                      >
                        {uniqueImages.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        ))}
                      </Slider>
                    )}
                  </div>

                  <div className="mt-auto">
                    <p className="text-lg font-bold text-right mb-3">
                      <span className="bg-gray-200 text-black px-3 py-1 rounded-md shadow-sm">
                        Bs {promocion.precio_promocion}
                      </span>
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComprar(promocion);
                      }}
                      className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        isInCart(promocion.id)
                          ? "bg-purple-700 hover:bg-purple-800 focus:ring-purple-600 text-white"
                          : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400 text-white"
                      }`}
                    >
                      {isInCart(promocion.id)
                        ? "Quitar del Carrito"
                        : "Agregar al Carrito"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Promociones;
