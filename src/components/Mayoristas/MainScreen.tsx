import React, { useState, useEffect } from "react";
import HeaderMayorista from "./HeaderMayorista";
import CategoriasUnoMayor from "./categoria/CategoriasunoMayor";

// IMPORTA el tipo Product desde donde esté definido correctamente

// IMPORTA la función fetchProducts desde la API
import { fetchProducts } from "../../utils/api";
import { AnimatedCircles, ProductCarouselMayor } from "./principalMayor/product-carouselMayor";


interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  fotos: Array<{ foto: string }>;
  stock: number // <- Agregar la propiedad stock
}
const MainScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-[#4e04f6] via-[#8004f5] to-[#e10ade]">
      <AnimatedCircles /> 
      <HeaderMayorista />
      
      <main className="flex-1">
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-2xl text-gray-600">Cargando productos...</div>
          </div>
        ) : (
          <ProductCarouselMayor
            products={products.filter((product) => product.stock > 0)}
          />
        )}
      </main>

      <CategoriasUnoMayor />
    </div>
  );
};


export default MainScreen;
