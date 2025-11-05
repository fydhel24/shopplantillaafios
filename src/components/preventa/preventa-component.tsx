"use client"

import { useEffect, useState } from "react"
import "./preventa-styles.css"
import { useCart, type Product } from "../carrito/CarritoContext" // Adjust the import path as needed

// Definición de tipos para la API
interface Foto {
  id: number
  foto: string
  created_at: string
  updated_at: string
  pivot: {
    id_producto: number
    id_foto: number
  }
}

interface Tipo {
  id: number
  tipo: string
  created_at: string
  updated_at: string
}

interface Marca {
  id: number
  marca: string
  created_at: string
  updated_at: string
}

interface CategoriaInfo {
  id: number
  categoria: string
  created_at: string
  updated_at: string
}

interface PrecioProducto {
  id: number
  id_producto: number
  precio_jefa: number | null
  precio_unitario: string
  cantidad: string
  precio_general: string
  precio_extra: string
  precio_preventa: string
  fecha_creada: null | string
  created_at: string
  updated_at: string
}

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: string
  precio_descuento: string | null
  stock: number
  estado: number
  fecha: string
  id_cupo: number | null
  id_tipo: number
  id_categoria: number
  id_marca: number
  created_at: string
  updated_at: string
  user_id: number | null
  precio_extra: string
  stock_sucursal_1: number
  categoria: CategoriaInfo
  marca: Marca
  tipo: Tipo
  cupo: any | null
  fotos: Foto[]
  precio_productos: PrecioProducto[]
}

interface Categoria {
  id: number
  categoria: string
  created_at: string
  updated_at: string
  productos: Producto[]
}

// Nuevo tipo para el modal
interface ModalProps {
  producto: Producto | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (producto: Producto, cantidad: number) => void
}

// Componente Modal
const PreventaModal: React.FC<ModalProps> = ({ producto, isOpen, onClose, onAddToCart }) => {
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    // Resetear cantidad cuando se abre el modal
    setCantidad(1)
  }, [isOpen])

  if (!isOpen || !producto) return null

  // Formatear precio para mostrar con 2 decimales
  const formatearPrecio = (precio: string) => {
    return Number.parseFloat(precio).toFixed(2)
  }

  // Obtener el precio de preventa si existe
  const getPrecioPreventa = (producto: Producto) => {
    if (producto.precio_productos && producto.precio_productos.length > 0) {
      return producto.precio_productos[0].precio_preventa
    }
    // Si no hay precio de preventa, usar el precio con descuento o precio normal
    return producto.precio_descuento || producto.precio
  }

  const precioPreventa = getPrecioPreventa(producto)
  const totalPrecio = (Number.parseFloat(precioPreventa) * cantidad).toFixed(2)
  const esStockLimitado = producto.tipo.tipo.toLowerCase() === "preventa_stock"

  return (
    <div className="modal-backdrop">
      <div className="preventa-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-container">
          <div className="modal-imagen">
            {producto.fotos.length > 0 ? (
              <img src={`https://importadoramiranda.com/storage/${producto.fotos[0].foto}`} alt={producto.nombre} />
            ) : (
              <div className="no-imagen">Sin imagen</div>
            )}
            <div className={`modal-badge ${esStockLimitado ? "limitado" : "sinlimite"}`}>
              {esStockLimitado ? "Edición Limitada" : "Preventa Abierta"}
            </div>
          </div>
          
          <div className="modal-info">
            <div className="modal-header">
              <div className="modal-marca">{producto.marca.marca}</div>
              <h2>{producto.nombre}</h2>
              <p className="modal-categoria">Categoría: {producto.categoria.categoria}</p>
            </div>
            
            <div className="modal-descripcion">
              <h3>Descripción del producto</h3>
              <p>{producto.descripcion}</p>
            </div>
            
            <div className="modal-detalles">
              {esStockLimitado && (
                <div className="modal-detalle">
                  <span className="detalle-label">Unidades disponibles:</span>
                  <span className="detalle-value">{producto.stock_sucursal_1}</span>
                </div>
              )}
              
              <div className="modal-detalle">
                <span className="detalle-label">Información de entrega:</span>
                <span className="detalle-value">Contactaremos por WhatsApp para coordinar la entrega una vez realizado el pedido.</span>
              </div>
              
              <div className="modal-detalle">
                <span className="detalle-label">Precio unitario:</span>
                <span className="detalle-value precio-destacado">Bs. {formatearPrecio(precioPreventa)}</span>
              </div>
            </div>
            
            <div className="modal-cantidad">
              <span className="cantidad-label">Cantidad:</span>
              <div className="cantidad-control">
                <button 
                  className="cantidad-btn" 
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="cantidad-value">{cantidad}</span>
                <button 
                  className="cantidad-btn" 
                  onClick={() => setCantidad(prev => 
                    esStockLimitado ? Math.min(producto.stock_sucursal_1, prev + 1) : prev + 1
                  )}
                  disabled={esStockLimitado && cantidad >= producto.stock_sucursal_1}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="modal-total">
              <span className="total-label">Total:</span>
              <span className="total-value">Bs. {totalPrecio}</span>
            </div>
            
            <div className="modal-info-preventa">
              <div className="info-icon"></div>
              <p>
                <strong>Este es un producto en preventa.</strong> Al reservar, estás asegurando tu compra anticipada.
                Te contactaremos por WhatsApp para coordinar todos los detalles de entrega.
              </p>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn-cancelar" onClick={onClose}>Cancelar</button>
              <button 
                className="modal-btn-reservar" 
                onClick={() => onAddToCart(producto, cantidad)}
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PreventaComponent() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("limitado")
  const [animateCards, setAnimateCards] = useState(false)
  const { addToCart } = useCart()
  
  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://importadoramiranda.com/api/lupe/categorias")
        if (!response.ok) {
          throw new Error("Error al cargar los datos")
        }
        const data = await response.json()
        setCategorias(data)
      } catch (err) {
        setError("Error al cargar los datos. Por favor, intente nuevamente más tarde.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
        // Activar animación de entrada para las tarjetas
        setTimeout(() => {
          setAnimateCards(true)
        }, 100)
      }
    }

    fetchData()
  }, [])

  // Filtrar productos por tipo sin depender de categorías
  const getProductosPorTipo = (tipoNombre: string) => {
    // Obtener todos los productos de todas las categorías
    const todosLosProductos = categorias.flatMap((categoria) => categoria.productos)

    // Filtrar por el tipo especificado
    return todosLosProductos.filter((producto) => producto.tipo.tipo.toLowerCase() === tipoNombre.toLowerCase())
  }

  const productosLimitados = getProductosPorTipo("Preventa_stock")
  const productosSinLimite = getProductosPorTipo("PreVenta_Sin_Limite")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setAnimateCards(false)
    // Reactivar animación después de cambiar tab
    setTimeout(() => {
      setAnimateCards(true)
    }, 100)
  }

  // Formatear precio para mostrar con 2 decimales
  const formatearPrecio = (precio: string) => {
    return Number.parseFloat(precio).toFixed(2)
  }

  // Obtener el precio de preventa si existe
  const getPrecioPreventa = (producto: Producto) => {
    if (producto.precio_productos && producto.precio_productos.length > 0) {
      return producto.precio_productos[0].precio_preventa
    }
    // Si no hay precio de preventa, usar el precio con descuento o precio normal
    return producto.precio_descuento || producto.precio
  }

  // Calcular porcentaje de descuento
  const calcularPorcentajeDescuento = (precioOriginal: string, precioDescuento: string) => {
    const original = Number.parseFloat(precioOriginal)
    const descuento = Number.parseFloat(precioDescuento)
    if (original <= 0 || descuento <= 0) return 0
    return Math.round(((original - descuento) / original) * 100)
  }

  // Función para abrir el modal
  const openProductModal = (producto: Producto) => {
    setSelectedProduct(producto)
    setModalOpen(true)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false)
    setSelectedProduct(null)
  }

  // Función para añadir al carrito desde el modal
  const handleAddToCart = (producto: Producto, cantidad: number) => {
    const precioPreventa = getPrecioPreventa(producto)
    const productToAdd: Product = {
      id: producto.id,
      name: producto.nombre,
      price: Number(precioPreventa),
      img: producto.fotos.length > 0 ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}` : "",
      discount: producto.precio_descuento && Number(producto.precio_descuento) < Number(producto.precio)
        ? calcularPorcentajeDescuento(producto.precio, producto.precio_descuento)
        : 0,
      quantity: cantidad,
      
    }
    
    addToCart(productToAdd)
    closeModal()
  }

  if (loading) {
    return (
      <div className="preventa-loading">
        <div className="loader"></div>
        <p>Cargando colección de productos...</p>
      </div>
    )
  }

  if (error) {
    return <div className="preventa-error">{error}</div>
  }

  return (
    <div className="preventa-container">
      <div className="preventa-header">
        <h1>Nuestras Colecciones en Preventa</h1>
        <p>Asegura tus productos favoritos antes de su lanzamiento oficial</p>
      </div>

      <div className="preventa-tabs">
        <button
          className={`tab-button ${activeTab === "limitado" ? "active" : ""}`}
          onClick={() => handleTabChange("limitado")}
        >
          <span className="tab-icon limited-icon"></span>
          Edición Limitada
        </button>
        <button
          className={`tab-button ${activeTab === "sinlimite" ? "active" : ""}`}
          onClick={() => handleTabChange("sinlimite")}
        >
          <span className="tab-icon unlimited-icon"></span>
          Disponibilidad Abierta
        </button>
      </div>

      <div className="preventa-content">
        {activeTab === "limitado" ? (
          <div className={`productos-grid ${animateCards ? "animate-in" : ""}`}>
            {productosLimitados.length > 0 ? (
              productosLimitados.map((producto, index) => (
                <div className="producto-card" key={producto.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="producto-badge limitado">Edición Limitada</div>
                  <div className="producto-imagen">
                    {producto.fotos.length > 0 ? (
                      <img
                        src={`https://importadoramiranda.com/storage/${producto.fotos[0].foto}`}
                        alt={producto.nombre}
                      />
                    ) : (
                      <div className="no-imagen">Sin imagen</div>
                    )}
                  </div>
                  <div className="producto-info">
                    <div className="producto-marca-tag">{producto.marca.marca}</div>
                    <h3>{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-stock">
                      <span className="stock-icon"></span>
                      <span>
                        Solo quedan <strong>{producto.stock_sucursal_1}</strong> unidades
                      </span>
                    </div>
                    <div className="producto-precios">
                      <span className="precio-original">
                        Bs. {formatearPrecio(getPrecioPreventa(producto))}
                      </span>
                    </div>
                    <div className="producto-botones">
                      <button
                        className="boton-reservar"
                        onClick={() => {
                          const productToAdd: Product = {
                            id: producto.id,
                            name: producto.nombre,
                            price: Number(getPrecioPreventa(producto)),
                            img: producto.fotos.length > 0 ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}` : "",
                            discount: producto.precio_descuento && Number(producto.precio_descuento) < Number(producto.precio)
                              ? calcularPorcentajeDescuento(producto.precio, producto.precio_descuento)
                              : 0,
                            quantity: 1,
                          }
                          addToCart(productToAdd)
                        }}
                      >
                        <span className="boton-icono"></span>
                        Reservar Ya
                      </button>
                      <button
                        className="boton-detalles"
                        onClick={() => openProductModal(producto)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-productos">
                <div className="no-productos-icon"></div>
                <p>No hay productos con stock limitado en esta categoría</p>
                <button className="boton-secundario" onClick={() => handleTabChange("sinlimite")}>
                  Ver productos de disponibilidad abierta
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`productos-grid ${animateCards ? "animate-in" : ""}`}>
            {productosSinLimite.length > 0 ? (
              productosSinLimite.map((producto, index) => (
                <div className="producto-card" key={producto.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="producto-badge sinlimite">Preventa Abierta</div>
                  <div className="producto-imagen">
                    {producto.fotos.length > 0 ? (
                      <img src={`https://importadoramiranda.com/storage/${producto.fotos[0].foto}`} alt={producto.nombre} />
                    ) : (
                      <div className="no-imagen">Sin imagen</div>
                    )}
                  </div>
                  <div className="producto-info">
                    <div className="producto-marca-tag">{producto.marca.marca}</div>
                    <h3>{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-disponibilidad">
                      <span className="disponibilidad-icon"></span>
                      <span>Reserva garantizada</span>
                    </div>
                    <div className="producto-precios">
                      <span className="precio-original">
                        Bs. {formatearPrecio(getPrecioPreventa(producto))}
                      </span>
                      {producto.precio_descuento &&
                        Number.parseFloat(producto.precio_descuento) < Number.parseFloat(producto.precio) && (
                          <span className="precio-tachado">Bs. {formatearPrecio(producto.precio)}</span>
                        )}
                    </div>
                    <div className="producto-botones">
                      <button
                        className="boton-reservar"
                        onClick={() => {
                          const productToAdd: Product = {
                            id: producto.id,
                            name: producto.nombre,
                            price: Number(getPrecioPreventa(producto)),
                            img: producto.fotos.length > 0 ? `https://importadoramiranda.com/storage/${producto.fotos[0].foto}` : "",
                            discount: producto.precio_descuento && Number(producto.precio_descuento) < Number(producto.precio)
                              ? calcularPorcentajeDescuento(producto.precio, producto.precio_descuento)
                              : 0,
                            quantity: 1,
                            
                          }
                          addToCart(productToAdd)
                        }}
                      >
                        <span className="boton-icono"></span>
                        Reservar Ya
                      </button>
                      <button
                        className="boton-detalles"
                        onClick={() => openProductModal(producto)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-productos">
                <div className="no-productos-icon"></div>
                <p>No hay productos sin límite de stock disponibles</p>
                <button className="boton-secundario" onClick={() => handleTabChange("limitado")}>
                  Ver productos de edición limitada
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="preventa-beneficios">
        <h2>{activeTab === "limitado" ? "Beneficios de Nuestro Catálogo" : "Ventajas de Preventa Abierta"}</h2>
        <div className="beneficios-grid">
          <div className="beneficio-card">
            <div className="beneficio-icon icon-1"></div>
            <h3>Reserva Anticipada</h3>
            <p>Garantiza tu producto antes del lanzamiento oficial y evita quedarte sin stock.</p>
          </div>
          <div className="beneficio-card">
            <div className="beneficio-icon icon-2"></div>
            <h3>Tienda Física en La Paz</h3>
            <p>Visítanos en cualquiera de nuestras 4 sucursales para atención personalizada.</p>
          </div>
          <div className="beneficio-card">
            <div className="beneficio-icon icon-3"></div>
            <h3>Confianza en Importadora Miranda</h3>
            <p>A un clic de recibir el producto que necesitas con total seguridad.</p>
          </div>
        </div>
      </div>

      {/* Modal para detalles de preventa */}
      <PreventaModal 
        producto={selectedProduct} 
        isOpen={modalOpen} 
        onClose={closeModal} 
        onAddToCart={handleAddToCart} 
      />
    </div>
  )
}