"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// ———————————————— Tipos ————————————————
interface ProductImage {
  id: number;
  foto: string;
}

interface Product {
  id: number;
  nombre: string;
  precio_extra: string;
  fotos: ProductImage[];
}

interface ProductCategory {
  id: number;
  categoria: string;
  productos: Product[];
}

// ———————————————— Componente: Imagen de producto (segura) ————————————————
const ProductThumbnail: React.FC<{ product: Product }> = ({ product }) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const primaryImage = product.fotos[0]?.foto?.trim();
  const imageUrl = primaryImage
    ? `https://afios.miracode.tech/storage/${primaryImage}`
    : null;

  if (loadFailed || !imageUrl) {
    return (
      <div
        className="w-14 h-14 flex items-center justify-center bg-gray-100 border border-dashed border-gray-300"
        aria-label="Sin imagen disponible"
      >
        <span className="text-xs text-gray-400">—</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      onError={() => setLoadFailed(true)}
      className="w-14 h-14 object-contain bg-white border border-gray-200"
      loading="lazy"
    />
  );
};

// ———————————————— Componente: Fila de producto en miniatura ————————————————
const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
      <ProductThumbnail product={product} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{product.nombre}</p>
        <p className="text-xs text-gray-600">Bs. {product.precio_extra}</p>
      </div>
    </div>
  );
};

// ———————————————— Componente: Tarjeta de categoría (formal, en dos columnas) ————————————————
const CategorySection: React.FC<{
  category: ProductCategory;
  onNavigate: () => void;
}> = ({ category, onNavigate }) => {
  return (
    <section
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      aria-labelledby={`category-title-${category.id}`}
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2
              id={`category-title-${category.id}`}
              className="text-lg font-semibold text-gray-900"
            >
              {category.categoria}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {category.productos.length} producto{category.productos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
            aria-label={`Ver todos los productos en ${category.categoria}`}
          >
            Ver categoría
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Productos destacados
        </h3>
        <div className="max-h-40 overflow-y-auto pr-1">
          {category.productos.slice(0, 5).map((product) => (
            <ProductRow key={`prod-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ———————————————— Componente: Barra de búsqueda funcional ————————————————
const SearchFilter: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}> = ({ value, onChange, onClear }) => {
  return (
    <div className="mb-8">
      <label htmlFor="category-search-input" className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar categorías
      </label>
      <div className="relative max-w-2xl">
        <input
          id="category-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escriba el nombre de una categoría..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            aria-label="Limpiar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {value && (
        <p className="mt-2 text-xs text-gray-500">
          Mostrando categorías que contienen: <span className="font-medium">"{value}"</span>
        </p>
      )}
    </div>
  );
};

// ———————————————— Componente principal ————————————————
const ProductCategoryExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ URL corregida: sin espacios
      const { data } = await axios.get<ProductCategory[]>(
        "https://afios.miracode.tech/api/lupe/categorias"
      );
      setCategories(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 404) {
        setError("El servicio de categorías no está disponible.");
      } else if (axiosError.code === "ECONNREFUSED" || axiosError.message.includes("network")) {
        setError("No se puede conectar con el servidor. Verifique su conexión.");
      } else {
        setError("Error al cargar las categorías. Intente nuevamente más tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((cat) => cat.categoria.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  const handleCategorySelect = (categoryName: string) => {
    navigate(`/categorias/${encodeURIComponent(categoryName)}`);
  };

  // ————— Render: Cargando —————
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-gray-600 text-sm">Cargando estructura de categorías...</p>
        </div>
      </div>
    );
  }

  // ————— Render: Error —————
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se pudieron cargar las categorías</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCategories}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ————— Render: Principal —————
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-28 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Categorías</h1>
          <p className="mt-2 text-gray-600">
            Seleccione una categoría para explorar su catálogo de productos. Los precios mostrados corresponden a la lista estándar.
          </p>
        </header>

        <SearchFilter
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-3 bg-gray-100 rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-medium">No se encontraron categorías</h3>
            <p className="text-gray-600 mt-1">
              {searchTerm
                ? `No hay categorías que coincidan con "${searchTerm}".`
                : "No hay categorías disponibles en este momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onNavigate={() => handleCategorySelect(category.categoria)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryExplorer;