"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ProductCard from "./prodcucto/ProductCard";

// Interfaz completa (igual que en ProductCard)
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
  }>;
}

interface Filtros {
  categoria: string;
  marca: string;
  precioMin: number;
  precioMax: number;
}

const FiltrosSidebar: React.FC<{
  filtros: Filtros;
  onChange: (nuevosFiltros: Partial<Filtros>) => void;
  categorias: string[];
  marcas: string[];
  rangoGlobal: { min: number; max: number };
}> = ({ filtros, onChange, categorias, marcas, rangoGlobal }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-fit sticky top-6">
      <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-900 mb-2">Categoría</label>
        <select
          value={filtros.categoria}
          onChange={(e) => onChange({ categoria: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat} className="text-gray-900">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">Marca</label>
        <select
          value={filtros.marca}
          onChange={(e) => onChange({ marca: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca} value={marca} className="text-gray-900">
              {marca}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de precios */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Precio: Bs. {filtros.precioMin.toLocaleString()} – Bs. {filtros.precioMax.toLocaleString()}
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min={rangoGlobal.min}
            max={rangoGlobal.max}
            step="1"
            value={filtros.precioMin}
            onChange={(e) => onChange({ precioMin: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={rangoGlobal.min}
            max={rangoGlobal.max}
            step="1"
            value={filtros.precioMax}
            onChange={(e) => onChange({ precioMax: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Bs. {rangoGlobal.min.toLocaleString()}</span>
          <span>Bs. {rangoGlobal.max.toLocaleString()}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            categoria: "",
            marca: "",
            precioMin: rangoGlobal.min,
            precioMax: rangoGlobal.max,
          })
        }
        className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
      >
        Restablecer filtros
      </button>
    </div>
  );
};

const TodosLosProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [filtros, setFiltros] = useState<Filtros>({
    categoria: "",
    marca: "",
    precioMin: 0,
    precioMax: 1000,
  });

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<any>(
        "https://afios.miracode.tech/api/lupe/categorias"
      );

      const productosCompletos: Producto[] = response.data.flatMap((categoria: any) =>
        categoria.productos.map((prod: any) => ({
          id: prod.id ?? 0,
          nombre: prod.nombre ?? "Sin nombre",
          descripcion: prod.descripcion ?? "",
          precio: prod.precio ?? "0",
          precio_descuento: prod.precio_descuento ?? "",
          stock: prod.stock ?? (prod.stock_sucursal_1 ?? 0),
          estado: prod.estado ?? 1,
          fecha: prod.fecha ?? "",
          id_cupo: prod.id_cupo ?? 0,
          id_tipo: prod.id_tipo ?? 0,
          id_categoria: prod.id_categoria ?? (prod.categoria?.id ?? 0),
          id_marca: prod.id_marca ?? (prod.marca?.id ?? 0),
          created_at: prod.created_at ?? "",
          updated_at: prod.updated_at ?? "",
          precio_extra: prod.precio_extra ?? prod.precio ?? "0",
          stock_sucursal_1: prod.stock_sucursal_1 ?? 0,
          categoria: prod.categoria ?? { id: 0, categoria: "Sin categoría" },
          marca: prod.marca ?? { id: 0, marca: "Sin marca" },
          tipo: prod.tipo ?? { id: 0, tipo: "N/A" },
          cupo: prod.cupo ?? {
            id: 0,
            codigo: "",
            porcentaje: "",
            estado: "",
            fecha_inicio: "",
            fecha_fin: "",
          },
          fotos: Array.isArray(prod.fotos) ? prod.fotos : [],
          precio_productos: Array.isArray(prod.precio_productos)
            ? prod.precio_productos
            : [],
        }))
      );

      setProductos(productosCompletos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos. Por favor, intente más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // ✅ Extraer categorías y marcas únicas
  const { categoriasUnicas, marcasUnicas } = useMemo(() => {
    const cats = new Set<string>();
    const marcas = new Set<string>();
    productos.forEach((p) => {
      if (p.categoria?.categoria) cats.add(p.categoria.categoria);
      if (p.marca?.marca) marcas.add(p.marca.marca);
    });
    return {
      categoriasUnicas: Array.from(cats).sort(),
      marcasUnicas: Array.from(marcas).sort(),
    };
  }, [productos]);

  // Rango global de precios
  const rangoPrecios = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    productos.forEach((p) => {
      const precio = parseFloat(String(p.precio_extra).replace(/[^0-9.]/g, "")) || 0;
      if (precio < min) min = precio;
      if (precio > max) max = precio;
    });
    return {
      min: min === Infinity ? 0 : Math.floor(min),
      max: max === -Infinity ? 1000 : Math.ceil(max),
    };
  }, [productos]);

  // Ajustar filtros iniciales al rango real
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      precioMin: rangoPrecios.min,
      precioMax: rangoPrecios.max,
    }));
  }, [rangoPrecios]);

  const getPrecioNumero = (precioStr: any): number => {
    if (precioStr == null) return 0;
    const str = String(precioStr).trim();
    if (str === "") return 0;
    const cleaned = str.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const productosFiltrados = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(query);
      const coincideCategoria =
        !filtros.categoria || producto.categoria?.categoria === filtros.categoria;
      const coincideMarca =
        !filtros.marca || producto.marca?.marca === filtros.marca;
      const precio = getPrecioNumero(producto.precio_extra);
      const dentroRango = precio >= filtros.precioMin && precio <= filtros.precioMax;
      return coincideBusqueda && coincideCategoria && coincideMarca && dentroRango;
    });
  }, [productos, searchQuery, filtros]);

  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + 20, productosFiltrados.length));
  const showLess = () =>
    setVisibleCount((prev) => Math.max(prev - 20, 20));

  if (loading && productos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-900 text-lg">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProductos}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50 text-gray-900 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Todos los productos</h1>
          <p className="text-gray-600 mt-1">
            {productos.length} productos • {productosFiltrados.length} coincidencias
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              aria-label="Buscar productos"
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(20);
              }}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <FiltrosSidebar
              filtros={filtros}
              onChange={(nuevos) => {
                setFiltros((prev) => ({ ...prev, ...nuevos }));
                setVisibleCount(20);
              }}
              categorias={categoriasUnicas}
              marcas={marcasUnicas}
              rangoGlobal={rangoPrecios}
            />
          </div>

          <div className="flex-1">
            {productosFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-600">No se encontraron productos.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4 justify-center">
                  {productosFiltrados.slice(0, visibleCount).map((producto) => (
                    <div key={producto.id} className="flex justify-center">
                      <ProductCard
                        producto={producto}
                        index={producto.id}
                        cartPosition={{ x: 0, y: 0 }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8 gap-3 flex-wrap">
                  {visibleCount > 20 && (
                    <button
                      onClick={showLess}
                      className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Ver menos
                    </button>
                  )}
                  {visibleCount < productosFiltrados.length && (
                    <button
                      onClick={showMore}
                      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Ver más ({productosFiltrados.length - visibleCount})
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodosLosProductos;