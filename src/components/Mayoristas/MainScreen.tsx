import React, { useState, useEffect } from "react";
import HeaderMayorista from "./HeaderMayorista";
import CategoriasUnoMayor from "./categoria/CategoriasunoMayor";
import { fetchProducts } from "../../utils/api";
import { ProductCarouselMayor } from "./principalMayor/product-carouselMayor";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  fotos: Array<{ foto: string }>;
  stock: number;
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
    <div className="relative w-full min-h-screen flex flex-col bg-white text-black">
      {/* Cabecera */}
      <HeaderMayorista />

      {/* Contenido principal */}
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

      {/* Categorías */}
      <CategoriasUnoMayor />
    </div>
  );
};

export default MainScreen;
