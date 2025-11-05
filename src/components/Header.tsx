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
  fotos?: Array<{
    id: number;
    foto: string;
  }>;
}

const SearchResultCard: React.FC<{
  product: Product;
  onSelect: (productId: string | number) => void;
}> = ({ product, onSelect }) => {
  const handleClick = () => {
    onSelect(product.id);
  };

  const productImage =
    product.fotos && product.fotos.length > 0
      ? `https://importadoramiranda.com/storage/${product.fotos[0].foto}`
      : "/placeholder.jpg";

  const displayPrice = product.precio_extra || product.precio || "0";

  return (
    <div
      onClick={handleClick}
      className="bg-white bg-opacity-80 backdrop-blur-md border border-gray-300 hover:bg-white hover:bg-opacity-100 transition-all duration-300 rounded-lg overflow-hidden shadow-lg flex cursor-pointer p-3 hover:scale-[1.02] transform"
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

      <div className="flex-1 p-2">
        <h3 className="text-sm font-bold text-black line-clamp-2 mb-1">
          {product.nombre}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-black font-bold">
            Bs. {displayPrice}
          </span>
          <span className="text-xs text-black/70 hover:text-black transition-colors">
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFocus = useRef<boolean>(false);

  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;
    setIsScrolled(currentScrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  const fetchCategoriesAndProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://importadoramiranda.com/api/lupe/categorias`
      );
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }
      const data = await response.json();
      const products = data.flatMap(
        (category: any) => category.productos || []
      );
      setAllProducts(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const searchProducts = useCallback(
    (query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);

      const filteredResults = allProducts.filter(
        (product: Product) =>
          product.nombre.toLowerCase().includes(query.toLowerCase()) ||
          (product.descripcion &&
            product.descripcion.toLowerCase().includes(query.toLowerCase())) ||
          (product.precio && product.precio.toString().includes(query)) ||
          (product.precio_extra &&
            product.precio_extra.toString().includes(query))
      );

      setSearchResults(filteredResults);
      setIsSearching(false);
    },
    [allProducts]
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.length > 0) {
        setShowResults(true);
      } else {
        setShowResults(false);
        setSearchResults([]);
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        searchProducts(query);
      }, 300);
    },
    [searchProducts]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/busqueda?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) {
      setShowResults(false);
      setSearchQuery("");
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          hasFocus.current = true;
        }
      }, 100);
    }
  };

  const handleProductSelect = (productId: string | number) => {
    navigate(`/producto/${productId}`);
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  };

  useEffect(() => {
    if (hasFocus.current && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchResults, showResults, searchQuery]);

  const SearchBar: React.FC<{
    searchQuery: string;
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isFullWidth?: boolean;
  }> = ({ searchQuery, handleSearchInputChange, isFullWidth = false }) => (
    <form
      onSubmit={handleSearchSubmit}
      className={`relative ${isFullWidth ? "w-full" : "w-full max-w-md"}`}
    >
      <div className="flex items-center relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 h-4 w-4" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="¿Qué estás buscando hoy?"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-full px-4 py-3 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/40 transition-all duration-300 bg-white text-black placeholder-black/50 font-medium shadow-sm"
          autoComplete="off"
          onFocus={() => { hasFocus.current = true; }}
          onBlur={() => { hasFocus.current = false; }}
          spellCheck={false}
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchQuery("");
              if (searchInputRef.current) {
                searchInputRef.current.focus();
                hasFocus.current = true;
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );

  const SearchResults: React.FC<{
    searchResults: Product[];
    isSearching: boolean;
    onProductSelect: (productId: string | number) => void;
  }> = ({ searchResults, isSearching, onProductSelect }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 mt-2 w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-300 overflow-y-auto max-h-96"
    >
      <div className="p-4">
        <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-3">
          <h4 className="text-lg font-bold text-black">
            {isSearching ? "Buscando..." : `Resultados (${searchResults.length})`}
          </h4>
          <button
            onClick={() => {
              setShowResults(false);
              if (searchInputRef.current) searchInputRef.current.focus();
              hasFocus.current = true;
            }}
            className="text-black/50 hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSearching ? (
          <div className="p-4 text-center text-black font-semibold">Buscando...</div>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-3">
            {searchResults.slice(0, 5).map((product) => (
              <motion.div
                key={`product-${product.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <SearchResultCard product={product} onSelect={onProductSelect} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-black font-medium">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
            <p className="text-sm text-black/50 mt-2">
              Intenta con otras palabras o categorías
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out font-sans backdrop-blur-md border-b border-gray-300 bg-white text-black`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3 md:space-x-4">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white border border-gray-300 p-1 flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src="/logo.png"
                  alt="Importadora Miranda"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/40x40?text=IM";
                  }}
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg md:text-xl font-bold text-black tracking-tight">
                  MiraCode Technology
                </h1>
                <p className="text-xs md:text-sm text-black/50 font-medium">
                  Producto que necesitas
                </p>
              </div>
            </Link>
          </motion.div>

          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-xl relative" ref={searchRef}>
              <SearchBar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                isFullWidth
              />
              <AnimatePresence>
                {showResults && searchQuery.trim() !== "" && (
                  <SearchResults
                    searchResults={searchResults}
                    isSearching={isSearching}
                    onProductSelect={handleProductSelect}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4 md:space-x-6">
            {[{ path: "/", label: "Home" }, { path: "/categorias", label: "Categorías" }, { path: "/todos-productos", label: "Productos" }, { path: "/promociones", label: "Ofertas" }].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group font-medium tracking-tight ${
                  currentPath === item.path
                    ? "text-black font-bold"
                    : "text-black/70 hover:text-black"
                } transition-all duration-300`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 ${
                    currentPath === item.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex md:hidden items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileSearch}
              className="text-black focus:outline-none p-2 hover:bg-gray-200 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black focus:outline-none p-2 hover:bg-gray-200 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mb-2 overflow-hidden"
              ref={searchRef}
            >
              <SearchBar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                isFullWidth
              />
              <AnimatePresence>
                {showResults && searchQuery.trim() !== "" && (
                  <SearchResults
                    searchResults={searchResults}
                    isSearching={isSearching}
                    onProductSelect={handleProductSelect}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border border-gray-300 rounded-lg mt-2 shadow-lg"
            >
              {[{ path: "/", label: "Home" }, { path: "/categorias", label: "Categorías" }, { path: "/todos-productos", label: "Productos" }, { path: "/promociones", label: "Ofertas" }].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-medium tracking-tight ${
                    currentPath === item.path
                      ? "bg-gray-200 text-black font-bold"
                      : "text-black/70 hover:bg-gray-100 hover:text-black"
                  } transition-all duration-300 border-b border-gray-300 last:border-0`}
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
