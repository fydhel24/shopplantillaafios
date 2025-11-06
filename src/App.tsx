import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Categorias from "./components/Categorias";
import TodosLosProductos from "./components/TodosLosProductos";
import FloatingCart from "./components/carrito/FloatingCart";
import { CartProvider, useCart } from "./components/carrito/CarritoContext";

import CategoriaProductos from "./components/CategoriaProductos";
import FormularioCompraPasos from "./components/steepformulario/index";
import FormularioMAyor from "./components/Mayoristas/steepformulario1/index1";

import Promociones from "./components/PromotionCard";
import CatalogoMayoristas from "./components/Mayoristas/CatalogoMayoristas";
import MainScreen from "./components/Mayoristas/MainScreen";
import { AuthProvider } from "./components/protec/AuthContext";
import ProtectedRoute from "./components/protec/ProtectedRoute";
import "./index.css";
import ProductDetails from "./components/detalle/ProductDetails";

import { fetchProducts } from "../src/utils/api";
import { ProductCarousel } from "../src/components/principal/product-carousel";
import PromotionDetails from "./components/detalle/PromotionDetails";

import Categoriasuno from "./components/categhoria/Categoriasuno";
import PromotionCardUno from "./components/PromotionCarduno";
import CategoriasMayor from "./components/Mayoristas/CategoriasMayor";
import HeaderMayorista from "./components/Mayoristas/HeaderMayorista";
import ProductosMayorista from "./components/Mayoristas/ProductosMayorista";
import CategoriaProductosMayor from "./components/Mayoristas/CategoriaProductosMayor";
import ProductDetailsMayor from "./components/Mayoristas/ProductDetailsMayor";
import PreventaComponent from "./components/preventa/preventa-component";
import SucursalesSection from "./components/SucursalesSection/SucursalesSection";
import SolicitudForm from "./components/trabaja_con_nosotros/trabaja_con_nosotros";
import Formulario from "./components/pedido/steps/Formulario";
import Formulario1 from "./components/pedido/steps_1/Formulario";

// ... (Previous interfaces and components remain the same)

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  fotos: Array<{ foto: string }>;
  stock: number; // <- Agregar la propiedad stock
}
const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  const hiddenFooterPaths = ["/catalogo", "/main"]; // Aquí puedes agregar las rutas protegidas

  if (hiddenFooterPaths.includes(location.pathname)) return null;

  return <Footer />;
};

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div>
            <ConditionalHeader />
            <MainContent />
            <ConditionalFooter />
            <CartIcon onOpenCart={handleOpenCart} />
            {isCartOpen && (
              <FloatingCart isCartOpen={isCartOpen} onClose={handleCloseCart} />
            )}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const CartIcon: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();

  // Agregar esta verificación para rutas mayoristas
  const isMayoristaRoute =
    location.pathname.startsWith("/categoriamayor") ||
    location.pathname.startsWith("/productosmayoristas") ||
    location.pathname.startsWith("/main") ||
    location.pathname.startsWith("/productomayor");

  if (location.pathname === "/pedidos" || location.pathname === "/catalogo") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center justify-center cursor-pointer shadow-lg rounded-full p-4 transition-transform duration-300 hover:scale-110 ${
        isMayoristaRoute ? "bg-blue-600" : "bg-white-600"
      }`}
      onClick={onOpenCart}
      style={{ zIndex: 1000 }}
    >
      {/* Ícono del carrito */}
      <span className="text-4xl">🛒</span>

      {/* Contador de productos */}
      {totalItems > 0 && (
        <span
          className="absolute top-1 right-1 bg-cyan-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border-2 border-white"
          style={{ transform: "translate(40%, -40%)" }}
        >
          {totalItems}
        </span>
      )}
    </div>
  );
};

const ConditionalHeader: React.FC = () => {
  const location = useLocation();
  const hiddenHeaderPaths = ["/pedidos", "/pedidos_1", "/catalogo", "/main"];
  const mayoristaPaths = [
    "/categoriamayor",
    "/productosmayoristas",
    "/productomayor",
  ];

  // Verificar si la ruta actual comienza con alguno de estos prefijos
  const isMayoristaRoute =
    mayoristaPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/categoriamayor/") ||
    location.pathname.startsWith("/productomayor/") ||
    location.pathname.startsWith("/pago1");

  if (isMayoristaRoute) {
    return <HeaderMayorista />;
  }

  if (hiddenHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return <Header height="h-32" />;
};

const MainContent: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div style={{ paddingTop: "15px" }}>
      <Routes>
        <Route path="/categorias" element={<Categorias />} />
        <Route
          path="/categorias/:categoryName"
          element={<CategoriaProductos />}
        />
        <Route path="/todos-productos" element={<TodosLosProductos />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/pago" element={<FormularioCompraPasos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/pedidos" element={<Formulario />} />
        <Route path="/pedidos_1" element={<Formulario1 />} />
        <Route path="/catalogo" element={<CatalogoMayoristas />} />
        <Route path="/producto/:productId" element={<ProductDetails />} />

        <Route
          path="/productomayor/:productId"
          element={<ProductDetailsMayor />}
        />
        <Route path="/promocion/:promotionId" element={<PromotionDetails />} />
        <Route
          path="/categoriamayor/:categoryMayorName"
          element={<CategoriaProductosMayor />}
        />
        <Route path="/categoriamayor" element={<CategoriasMayor />} />
        <Route path="/productosmayoristas" element={<ProductosMayorista />} />
        <Route path="/pago1" element={<FormularioMAyor />} />
        <Route path="/trabaja-con-nosotros" element={<SolicitudForm />} />

        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};
const HomePage: React.FC = () => {
  const [fallingImages, setFallingImages] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPhoneAlert] = useState(true);

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

  useEffect(() => {
    // Create more falling images for larger screens, fewer for mobile
    const getImageCount = () => {
      if (typeof window !== "undefined") {
        return window.innerWidth > 1024
          ? 20
          : window.innerWidth > 768
          ? 15
          : 10;
      }
      return 15; // Default if window is not available
    };

    const imagesArray = Array.from({ length: getImageCount() }, (_, index) => ({
      id: index,
      size: Math.random() * 60 + 40, // Slightly smaller images for better performance
      left: Math.random() * 100,
      delay: Math.random() * 5,
      rotation: Math.random() * 360, // Add rotation for more visual interest
    }));

    setFallingImages(imagesArray);

    // Update falling images on window resize
    const handleResize = () => {
      const newCount = getImageCount();
      if (newCount !== fallingImages.length) {
        const newImagesArray = Array.from({ length: newCount }, (_, index) => ({
          id: index,
          size: Math.random() * 60 + 40,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          rotation: Math.random() * 360,
        }));
        setFallingImages(newImagesArray);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-800 via-cyan-600 to-teal-900 overflow-hidden">
        <div className="falling-background relative">
          {fallingImages.map((image) => (
            <img
              key={image.id}
              src="/logo.png"
              alt="Logo"
              className="falling-logo absolute"
              style={{
                left: `${image.left}%`,
                width: `${image.size}px`,
                height: `${image.size}px`,
                transform: `rotate(${image.rotation}deg)`,
                animationDuration: `${6 + image.delay}s`,
                animationDelay: `${image.delay}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <section>
          <Categoriasuno />
        </section>
        <section>
          <div>
            <ProductCarousel
              products={products.filter((product) => product.stock > 0)}
            />
          </div>
        </section>

        {/* 
        <section>
          <PreventaComponent />
        </section> */}

        {/* <section>
          <SucursalesSection />
        </section> */}
      </div>
    </>
  );
};

export default App;
