"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nombre: string;
  precio_extra: string;
  fotos: {
    id: number;
    foto: string;
  }[];
}

interface Category {
  id: number;
  categoria: string;
  productos: Product[];
}

const Categorias: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://importadoramiranda.com/api/lupe/categorias"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category: Category) => {
    navigate(`/categorias/${category.categoria}`);
  };

  if (loading)
    return (
      <div className="text-center py-10 text-emerald-400 font-semibold">
        Cargando categorías...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-emerald-700 px-4 py-12 text-white font-sans">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
            Categorías
          </h1>
          <p className="text-lg text-cyan-300">
            Elige una categoría para explorar productos
          </p>
        </header>

        <div className="sticky top-24 z-50 mb-8">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full max-w-md mx-auto px-5 py-3 rounded-full border-2 border-cyan-400 bg-blue-900 placeholder-cyan-400 text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500 transition-shadow shadow-md hover:shadow-xl"
          />
        </div>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-lg border border-cyan-500 hover:scale-[1.03] transform transition-transform duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold mb-5 text-cyan-200 text-center">
                  Las mejores ofertas para ti en{" "}
                  <span className="lowercase">{category.categoria}</span>
                </h2>

                <div className="grid grid-cols-2 gap-4 flex-grow">
                  {category.productos.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="relative group rounded-lg overflow-hidden shadow-md bg-blue-950"
                    >
                      <div className="aspect-square bg-gray-800 rounded-md overflow-hidden">
                        {product.fotos.length > 0 ? (
                          <img
                            src={`https://importadoramiranda.com/storage/${product.fotos[0].foto}`}
                            alt={product.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-cyan-300 truncate px-2">
                        {product.nombre}
                      </h3>
                      <p className="text-xs font-bold text-emerald-400 px-2 pb-2">
                        ${product.precio_extra}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <span className="inline-block bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full text-white font-semibold cursor-pointer select-none transition-colors duration-300">
                    Ver Colección
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categorias;
