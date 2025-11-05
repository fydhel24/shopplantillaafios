"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  height?: string;
}

interface Product {
  id: string | number;
  nombre: string;
  descripcion?: string;
  precio_extra?: string;
  precio?: string;
  fotos?: Array<{ id: number; foto: string }>;
}

const SearchResultCard: React.FC<{
  product: Product;
  onSelect: (productId: string | number) => void;
}> = ({ product, onSelect }) => {
  const handleClick = () => onSelect(product.id);

  const productImage =
    product.fotos && product.fotos.length > 0
      ? `https://importadoramiranda.com/storage/${product.fotos[0].foto}`
      : "/placeholder.jpg";

  const price = product.precio_extra || product.precio || "0";

  return (
    <div
      onClick={handleClick}
      className="bg-white hover:bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex cursor-pointer p-3 transition-all duration-300 hover:shadow-md"
    >
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden shadow-md">
        <img
          src={productImage || "/placeholder.svg"}
          alt={product.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />
      </div>
      <div className="flex-1 pl-3 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.nombre}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-red-600 font-semibold text-sm">
            Bs. {price}
          </span>
          <span className="text-xs text-gray-500 hover:text-red-600 transition-colors">
            Ver →
          </span>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ height = "h-16" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFocus = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`https://importadoramiranda.com/api/lupe/categorias`);
      const data = await res.json();
      const products = data.flatMap((c: any) => c.productos || []);
      setAllProducts(products);
    } catch (err) {
      console.error("Error al obtener productos", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const searchProducts = useCallback(
    (query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const results = allProducts.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    },
    [allProducts]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setShowResults(query.length > 0);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => searchProducts(query), 300);
    },
    [searchProducts]
  );

  const handleProductSelect = (id: string | number) => {
    navigate(`/producto/${id}`);
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  };

  const SearchBar = ({
    searchQuery,
    onChange,
    isFullWidth = false,
  }: {
    searchQuery: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isFullWidth?: boolean;
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (searchQuery.trim())
          navigate(`/busqueda?q=${encodeURIComponent(searchQuery)}`);
      }}
      className={`relative ${isFullWidth ? "w-full" : "max-w-md"}`}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-500 h-4 w-4" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={onChange}
          className="w-full px-4 py-2 pl-9 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-gray-700 placeholder-gray-400 bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              if (searchInputRef.current) searchInputRef.current.focus();
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );

  const SearchResults = ({
    results,
    onSelect,
  }: {
    results: Product[];
    onSelect: (id: string | number) => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
    >
      <div className="p-3">
        {results.length > 0 ? (
          results.slice(0, 6).map((p) => (
            <SearchResultCard key={p.id} product={p} onSelect={onSelect} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">
            No se encontraron productos.
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border border-gray-300"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-800">
                Zona Mayorista
              </h1>
              <p className="text-xs text-gray-500">
                A un clic del producto que necesitas
              </p>
            </div>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:block w-full max-w-lg relative" ref={searchRef}>
            <SearchBar searchQuery={searchQuery} onChange={handleSearchChange} />
            <AnimatePresence>
              {showResults && (
                <SearchResults
                  results={searchResults}
                  onSelect={handleProductSelect}
                />
              )}
            </AnimatePresence>
          </div>

          {/* MENU LINKS */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { path: "/", label: "Inicio" },
              { path: "/categorias", label: "Categorías" },
              { path: "/todos-productos", label: "Productos" },
              { path: "/promociones", label: "Ofertas" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all ${
                  currentPath === item.path
                    ? "text-red-600 border-b-2 border-red-600 pb-1"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* MOBILE MENU */}
          <div className="flex md:hidden items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pb-4"
              ref={searchRef}
            >
              <SearchBar searchQuery={searchQuery} onChange={handleSearchChange} />
              <AnimatePresence>
                {showResults && (
                  <SearchResults
                    results={searchResults}
                    onSelect={handleProductSelect}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-200 mt-2"
            >
              {[
                { path: "/", label: "Inicio" },
                { path: "/categorias", label: "Categorías" },
                { path: "/todos-productos", label: "Productos" },
                { path: "/promociones", label: "Ofertas" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-6 py-3 text-sm font-medium ${
                    currentPath === item.path
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
