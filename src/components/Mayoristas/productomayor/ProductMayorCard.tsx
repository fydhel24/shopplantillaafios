"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useCart } from "../../carrito/CarritoContext";
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
    cantidad: string;
  }>;
}

interface ProductCardProps {
  producto: Producto;
  index: number;
  cartPosition: { x: number; y: number };
  isFeatured?: boolean;
  showStar?: boolean;
}

const ProductMayorCard: React.FC<ProductCardProps> = ({
  producto,
  cartPosition,
}) => {
  const navigate = useNavigate();
  const { addToCart, incrementQuantity, removeFromCart, cartItems } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPriceType, setSelectedPriceType] = useState<"box" | "dozen">(
    "box"
  );

  const isInCart = useCallback(
    (id: number) => cartItems.some((item) => item.id === id),
    [cartItems]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (producto.stock_sucursal_1 === 0 || isAnimating) return;

    setIsAnimating(true);

    const price =
      selectedPriceType === "box"
        ? Number.parseFloat(
            producto.precio_productos[0]?.precio_unitario ||
              producto.precio_extra ||
              "0"
          )
        : Number.parseFloat(
            producto.precio_productos[0]?.precio_general ||
              producto.precio ||
              "0"
          );

    if (!isInCart(producto.id)) {
      addToCart({
        id: producto.id,
        name: producto.nombre,
        price: price,
        img: producto.fotos[0]?.foto
          ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}`
          : "/placeholder.jpg",
      });
    } else {
      incrementQuantity(producto.id);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart(producto.id)) {
      removeFromCart(producto.id);
    }
  };

  const handleNavigateToDetails = () => {
    navigate(`/productomayor/${producto.id}`);
  };

  // Get the quantity per box (con valor predeterminado)
  const quantityPerBox = producto.precio_productos[0]?.cantidad || "1";

  // Format prices with commas for thousands
  const formatPrice = (price: string | number) => {
    // Si price es undefined o NaN, retorna "0.00"
    if (price === undefined || price === null || isNaN(Number(price))) {
      return "0.00";
    }
    return Number(price).toLocaleString("es-BO", { minimumFractionDigits: 2 });
  };

  // Cálculo seguro del precio por docena
  const calcularPrecioDocena = () => {
    const precioGeneral = producto.precio_productos[0]?.precio_general;
    if (!precioGeneral) return "0";

    // Asegurarnos que es un número válido
    const precio = parseFloat(precioGeneral);
    return isNaN(precio) ? "0" : (precio * 12).toString();
  };

  // Cálculo seguro del precio por caja
  const calcularPrecioCaja = () => {
    const precioUnitario = producto.precio_productos[0]?.precio_unitario;
    const cantidad = producto.precio_productos[0]?.cantidad;

    if (!precioUnitario || !cantidad) return "0";

    // Asegurarnos que son números válidos
    const precio = parseFloat(precioUnitario);
    const cant = parseFloat(cantidad);

    return isNaN(precio) || isNaN(cant) ? "0" : (precio * cant).toString();
  };

  const dozenPrice = formatPrice(calcularPrecioDocena());
  const boxPrice = formatPrice(calcularPrecioCaja());

  const carouselItems =
    producto.fotos && producto.fotos.length > 0
      ? producto.fotos.map((foto) => (
          <div key={foto.id}>
            <img
              src={`https://importadoramiranda.com/storage/${foto.foto}`}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
          </div>
        ))
      : [
          <div key="placeholder">
            <img
              src="/placeholder.jpg"
              alt="Producto sin imagen"
              className="w-full h-48 object-cover"
            />
          </div>,
        ];

  return (
    <div className="mb-4">
      <div
        className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 bg-white hover:shadow-xl border border-gray-200 flex flex-col h-full"
        onClick={handleNavigateToDetails}
      >
        {producto.stock_sucursal_1 === 0 && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-600 bg-opacity-75 z-10">
            <span className="text-white text-xl font-bold flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> AGOTADO
            </span>
          </div>
        )}

        <div className="relative">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            className="rounded-t-lg"
            showStatus={false}
            interval={5000}
          >
            {carouselItems}
          </Carousel>

          <div className="absolute top-2 right-2 z-10">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm line-clamp-1 max-w-[200px]">
              {producto.nombre}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow">
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex flex-col items-center w-full">
                <span className="text-xs text-blue-700 font-medium">
                  Precio por Caja(UNIDAD)
                </span>
                <span className="font-bold text-blue-800 text-lg">
                  Bs.{" "}
                  {formatPrice(
                    Number(calcularPrecioCaja()) / Number(quantityPerBox)
                  )}
                </span>
              </div>
              {/* <div className="flex flex-col items-center w-full">
                <span className="text-xs text-blue-700 font-medium">
                  Precio por Caja
                </span>
                <span className="font-bold text-blue-800 text-lg">
                  Bs. {boxPrice}
                </span>
              </div> */}
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <div className="flex flex-col items-center w-full">
                <span className="text-xs text-indigo-700 font-medium">
                  Precio por Docena(UNIDAD)
                </span>
                <span className="font-bold text-indigo-800 text-lg">
                  Bs. {formatPrice(Number(calcularPrecioDocena()) / 12)}
                </span>
              </div>
              {/* <div className="flex flex-col items-center w-full">
                <span className="text-xs text-indigo-700 font-medium">
                  Precio por Docena
                </span>
                <span className="font-bold text-indigo-800 text-lg">
                  Bs. {dozenPrice}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMayorCard;

// import React, { useCallback, useState } from "react";
// import { useCart } from "../../carrito/CarritoContext";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useNavigate } from "react-router-dom";

// interface Producto {
//   id: number;
//   nombre: string;
//   descripcion: string;
//   precio: string;
//   precio_descuento: string;
//   stock: number;
//   estado: number;
//   fecha: string;
//   id_cupo: number;
//   id_tipo: number;
//   id_categoria: number;
//   id_marca: number;
//   created_at: string;
//   updated_at: string;
//   precio_extra: string;
//   stock_sucursal_1: number;
//   categoria: { id: number; categoria: string };
//   marca: { id: number; marca: string };
//   tipo: { id: number; tipo: string };
//   cupo: {
//     id: number;
//     codigo: string;
//     porcentaje: string;
//     estado: string;
//     fecha_inicio: string;
//     fecha_fin: string;
//   };
//   fotos: Array<{ id: number; foto: string }>;
//   precio_productos: Array<{
//     id: number;
//     precio_unitario: string;
//     precio_general: string;
//     precio_extra: string;
//     cantidad: string;
//   }>;
// }

// interface ProductCardProps {
//   producto: Producto;
//   index: number;
//   cartPosition: { x: number; y: number };
//   isFeatured?: boolean;
//   showStar?: boolean;
// }

// const ProductMayorCard: React.FC<ProductCardProps> = ({
//   producto,
//   cartPosition,
// }) => {
//   const navigate = useNavigate();
//   const { addToCart, incrementQuantity, removeFromCart, cartItems } = useCart();
//   const [isAnimating, setIsAnimating] = useState(false);

//   const isInCart = useCallback(
//     (id: number) => cartItems.some((item) => item.id === id),
//     [cartItems]
//   );

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (producto.stock_sucursal_1 === 0 || isAnimating) return;

//     setIsAnimating(true);

//     if (!isInCart(producto.id)) {
//       addToCart({
//         id: producto.id,
//         name: producto.nombre,
//         price: Number.parseFloat(producto.precio_extra),
//         img: producto.fotos[0]?.foto
//           ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}`
//           : "/placeholder.jpg",
//       });
//     } else {
//       incrementQuantity(producto.id);
//     }

//     setIsAnimating(false);
//   };

//   const handleRemoveFromCart = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (isInCart(producto.id)) {
//       removeFromCart(producto.id);
//     }
//     navigate(`/productomayor/${producto.id}`);
//   };

//   const handleNavigateToDetails = () => {
//     navigate(`/productomayor/${producto.id}`);
//   };

//   return (
//     <div className="mb-4">
//       <div
//         className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 bg-white hover:bg-opacity-95 border border-blue-300"
//         onClick={handleNavigateToDetails}
//       >
//         {producto.stock_sucursal_1 === 0 && (
//           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-600 bg-opacity-75 z-10">
//             <span className="text-white text-xl font-bold">AGOTADO</span>
//           </div>
//         )}

//         <Carousel
//           showThumbs={false}
//           autoPlay
//           infiniteLoop
//           className="rounded-lg"
//           showStatus={false}
//           interval={5000}
//         >
//           {producto.fotos.map((foto) => (
//             <div key={foto.id}>
//               <img
//                 src={`https://importadoramiranda.com/storage/${foto.foto}`}
//                 alt={producto.nombre}
//                 className="w-full h-48 object-cover"
//               />
//             </div>
//           ))}
//         </Carousel>

//         {/* <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-transparent text-white p-2">
//           <h3 className="text-sm font-medium">{producto.nombre}</h3>
//           <div className="flex justify-between items-center mt-1">
//             <span className="text-lg font-bold">
//               Bs. {producto.precio_extra || producto.precio}
//             </span>
//             {parseFloat(producto.precio) >
//               parseFloat(producto.precio_extra || producto.precio) && (
//               <span className="text-sm line-through text-gray-300">
//                 Bs. {producto.precio}
//               </span>
//             )}
//           </div>
//         </div> */}

//         {/* <div className="absolute bottom-4 right-4 z-20 flex gap-2">
//           <button
//             onClick={(e) => handleAddToCart(e)}
//             disabled={producto.stock_sucursal_1 === 0}
//             className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
//               producto.stock_sucursal_1 === 0
//                 ? "bg-red-700 cursor-not-allowed opacity-50"
//                 : isInCart(producto.id)
//                 ? "bg-blue-500"
//                 : "bg-cyan-500 hover:bg-cyan-600"
//             }`}
//           >
//             <i className="fas fa-shopping-cart text-white text-xl"></i>
//           </button>

//           {isInCart(producto.id) && (
//             <button
//               onClick={(e) => handleRemoveFromCart(e)}
//               className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
//             >
//               ✖
//             </button>
//           )}
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default ProductMayorCard;
