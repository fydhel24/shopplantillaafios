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
      className="bg-white hover:bg-gray-100 border border-gray-200 transition-all duration-300 rounded-lg overflow-hidden shadow-md flex cursor-pointer p-3 hover:scale-[1.02] transform"
    >
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden shadow-sm">
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
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {product.nombre}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">Bs. {displayPrice}</span>
          <span className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
  }> = ({ searchQuery, handleSearchInputChange, isFullWidth = false }) => {
    return (
      <form
        onSubmit={handleSearchSubmit}
        className={`relative ${isFullWidth ? "w-full" : "w-64"}`}
      >
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full px-3 py-2 pl-9 pr-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm font-medium shadow-sm"
            autoComplete="off"
            onFocus={() => {
              hasFocus.current = true;
            }}
            onBlur={() => {
              hasFocus.current = false;
            }}
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    );
  };

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
      className="absolute z-50 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-xl overflow-y-auto max-h-96"
    >
      <div className="p-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
          <h4 className="text-lg font-semibold text-gray-900">
            {isSearching
              ? "Buscando..."
              : `Resultados (${searchResults.length})`}
          </h4>
          <button
            onClick={() => {
              setShowResults(false);
              if (searchInputRef.current) {
                searchInputRef.current.focus();
                hasFocus.current = true;
              }
            }}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSearching ? (
          <div className="p-4 text-center text-gray-600 font-medium">
            Buscando...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-3">
            {searchResults.slice(0, 5).map((product) => (
              <motion.div
                key={`product-${product.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <SearchResultCard
                  product={product}
                  onSelect={onProductSelect}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 font-medium">
              No se encontraron productos que coincidan
            </p>
            <p className="text-sm text-gray-500 mt-2">
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out font-sans ${
        isScrolled
          ? "shadow-md bg-white/95 backdrop-blur-md"
          : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-gray-100 border border-gray-200 p-1 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="/logo.png"
                alt="Importadora Miranda"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                MiraCode Technology
              </h1>
            </div>
          </Link>

          {/* Menu centrado y buscador a la derecha en escritorio */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <nav className="flex space-x-6">
              {[
                { path: "/", label: "Inicio" },
                { path: "/todos-productos", label: "Productos" },
                { path: "/categorias", label: "Categorias" },
                { path: "/promociones", label: "Ofertas" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group font-semibold tracking-tight ${
                    currentPath === item.path
                      ? "text-blue-600 font-bold"
                      : "text-gray-700 hover:text-blue-600"
                  } transition-all duration-300`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform transition-transform duration-300 ${
                      currentPath === item.path
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="relative ml-auto" ref={searchRef}>
              <SearchBar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
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

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileSearch}
              className="text-gray-800 focus:outline-none p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile search and menu remain igual */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mb-4 overflow-hidden"
              ref={searchRef}
            >
              <SearchBar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                isFullWidth={true}
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
              className="md:hidden overflow-hidden bg-white border border-gray-200 rounded-lg mt-2 shadow-md"
            >
              {[
                { path: "/", label: "Inicio" },
                { path: "/todos-productos", label: "Productos" },
                { path: "/categorias", label: "Categorias" },
                { path: "/promociones", label: "Ofertass " },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold tracking-tight ${
                    currentPath === item.path
                      ? "bg-gray-100 text-blue-600 font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  } transition-all duration-300 border-b border-gray-100 last:border-0`}
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
