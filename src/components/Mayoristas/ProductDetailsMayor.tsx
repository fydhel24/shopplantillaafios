"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Box, Package, ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart } from "../carrito/CarritoContext"

interface Foto {
  id: number
  foto: string
  pivot: {
    id_producto: number
    id_foto: number
  }
}

interface PrecioProducto {
  id: number
  id_producto: number
  precio_jefa: string | null
  precio_unitario: string
  cantidad: string
  precio_general: string
  precio_extra: string
  fecha_creada: string | null
  created_at: string
  updated_at: string
}

interface Inventario {
  id: number
  id_producto: number
  id_sucursal: number
  cantidad: number
}

interface ProductDetails {
  id: number
  nombre: string
  descripcion: string
  precio: string
  precio_descuento: string
  stock: number
  estado: number
  fecha: string
  id_cupo: number
  id_tipo: number
  id_categoria: number
  id_marca: number
  created_at: string
  updated_at: string
  user_id: number | null
  precio_extra: string
  cantidad_sucursal_1: string
  categoria: {
    id: number
    categoria: string
  }
  marca: {
    id: number
    marca: string
  }
  tipo: {
    id: number
    tipo: string
  }
  fotos: Foto[]
  precio_productos: PrecioProducto[]
  inventarios: Inventario[]
}

type QuantityType = "box" | "dozen"

const ProductDetailsMayor: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const { addToCart, incrementQuantity } = useCart()
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [selectedQuantityType, setSelectedQuantityType] = useState<QuantityType>("dozen")
  const [quantity, setQuantity] = useState(6)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  // Fetch product data from the API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://importadoramiranda.com/api/producto/${productId}`)
        const data = await response.json()
        setProductDetails(data)
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  // Calculate pricing information
  const getPricing = () => {
    if (!productDetails || !productDetails.precio_productos || productDetails.precio_productos.length === 0) {
      return {
        dozen: { unitPrice: 0, totalPrice: 0, minQuantity: 1 },
        box: { unitPrice: 0, totalPrice: 0, minQuantity: 1, unitsPerBox: 24 },
      }
    }

    const precioProducto = productDetails.precio_productos[0]

    // Use parseFloat and provide fallbacks to avoid NaN
    const precioGeneral = Number.parseFloat(precioProducto.precio_general || "0")
    const precioUnitario = Number.parseFloat(precioProducto.precio_unitario || "0")
    const precioExtra = Number.parseFloat(precioProducto.precio_extra || "0")

    // Default to 24 if cantidad is missing or not a valid number
    let cantidadPorCaja = 24
    if (precioProducto.cantidad && !isNaN(Number.parseFloat(precioProducto.cantidad))) {
      cantidadPorCaja = Number.parseFloat(precioProducto.cantidad)
    }

    return {
      dozen: {
        unitPrice: precioGeneral,
        totalPrice: precioGeneral * quantity * 12,
        minQuantity: 6, // 6 units minimum
      },
      box: {
        unitPrice: precioUnitario,
        totalPrice: precioUnitario * cantidadPorCaja * quantity,
        minQuantity: 1, // 1 box minimum
        unitsPerBox: cantidadPorCaja,
      },
    }
  }

  const pricing = getPricing()

  // Calculate total price based on selected quantity type and quantity
  const calculateTotalPrice = () => {
    if (selectedQuantityType === "dozen") {
      return pricing.dozen.unitPrice * quantity
    } else {
      // box
      return pricing.box.unitPrice * quantity
    }
  }

  // Calculate price per unit
  const calculatePricePerUnit = () => {
    if (selectedQuantityType === "dozen") {
      return pricing.dozen.unitPrice
    } else {
      // box
      return pricing.box.unitPrice
    }
  }

  // Calculate total units
  const calculateTotalUnits = () => {
    return quantity
  }

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (selectedQuantityType === "dozen") {
      // For dozen pricing, ensure minimum of 6 units (not 12)
      setQuantity(Math.max(6, newQuantity))
    } else if (selectedQuantityType === "box") {
      // For box pricing, ensure minimum of the box quantity
      const minBoxQuantity = pricing.box.unitsPerBox || 24
      setQuantity(Math.max(minBoxQuantity, newQuantity))
    }
  }

  // Update quantity when quantity type changes
  useEffect(() => {
    if (selectedQuantityType === "dozen") {
      setQuantity(6) // Minimum 6 units for dozen pricing
    } else if (selectedQuantityType === "box") {
      const minBoxQuantity = pricing.box.unitsPerBox || 24
      setQuantity(minBoxQuantity) // Minimum box quantity for box pricing
    }
  }, [selectedQuantityType])

  // Handle add to cart
  function handleAddToCart() {
    if (!productDetails) return

    // Get the price per unit (not the total)
    const pricePerUnit = calculatePricePerUnit()

    // Add to cart without quantity (CartContext will set quantity=1)
    addToCart({
      id: productDetails.id,
      name: productDetails.nombre,
      price: pricePerUnit,
      img:
        productDetails.fotos.length > 0
          ? `https://importadoramiranda.com/storage/${productDetails.fotos[0].foto}`
          : "/placeholder.svg?height=200&width=200",
    })

    // If we need more than 1 quantity, call incrementQuantity multiple times
    // We subtract 1 because addToCart already sets quantity to 1
    const additionalQuantity = calculateTotalUnits() - 1

    if (additionalQuantity > 0) {
      // We need to use setTimeout to ensure the product is added first
      setTimeout(() => {
        for (let i = 0; i < additionalQuantity; i++) {
          incrementQuantity(productDetails.id)
        }
      }, 100)
    }
    setShowSummary(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Producto no encontrado</h2>
          <p className="text-gray-500 mt-2">No pudimos encontrar los detalles de este producto.</p>
        </div>
      </div>
    )
  }
  const toggleSummary = () => {
    setShowSummary(!showSummary)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 mt-[3cm]">
        {/* Product Images and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              {productDetails?.fotos?.[selectedImage]?.foto && (
                <img
                  src={`https://importadoramiranda.com/storage/${productDetails.fotos[selectedImage].foto}`}
                  alt={productDetails?.nombre}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {productDetails?.fotos?.map((foto, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${selectedImage === index ? "ring-2 ring-blue-600" : ""}`}
                >
                  <img
                    src={`https://importadoramiranda.com/storage/${foto.foto}`}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900">{productDetails?.nombre}</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Producto</h2>
              <p className="text-gray-700 text-base leading-relaxed">{productDetails?.descripcion}</p>
            </div>

            {/* Stock Information
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-blue-800 font-medium flex items-center gap-2">
                <Info className="w-5 h-5" />
                Stock disponible: {productDetails.cantidad_sucursal_1} unidades
              </p>
            </div> */}

            {/* Pricing Options */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Precios por Volumen</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedQuantityType("dozen")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedQuantityType === "dozen"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Package className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="text-sm font-semibold text-blue-900">Por Docena</div>
                  <div className="text-xs text-gray-500">Min. 6 unidades</div>
                  <div className="text-blue-600 font-bold mt-1">Bs. {pricing.dozen.unitPrice.toFixed(2)} / unidad</div>
                </button>

                <button
                  onClick={() => setSelectedQuantityType("box")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedQuantityType === "box"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Box className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="text-sm font-semibold text-blue-900">Por Caja</div>
                  <div className="text-xs text-gray-500">{pricing.box.unitsPerBox} unidades por caja</div>
                  <div className="text-blue-600 font-bold mt-1">Bs. {pricing.box.unitPrice.toFixed(2)} / unidad</div>
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900">Cantidad:</span>
                  <span className="text-sm text-blue-700">
                    {selectedQuantityType === "dozen"
                      ? `${quantity} unidades (precio por docena)`
                      : `${quantity} unidades (precio por caja)`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= pricing[selectedQuantityType].minQuantity}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min={selectedQuantityType === "dozen" ? 6 : pricing.box.unitsPerBox || 24}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-16 text-center text-xl font-bold text-blue-900 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600"
                    />
                    <span className="text-xs text-blue-700">
                      {selectedQuantityType === "dozen" ? "unidades" : "unidades"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Total Price Summary */}
                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">Total:</span>
                    <div className="text-right">
                      <div className="text-sm text-blue-700">
                        {calculateTotalUnits()} unidades x Bs. {calculatePricePerUnit().toFixed(2)}
                      </div>
                      <div className="text-xl font-bold text-blue-900">Bs. {calculateTotalPrice().toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Añadir al Carrito
                </button>
              </div>
            </div>
            
          </div>



        </div>
      </div>
      
    </div>
    
  )
}

export default ProductDetailsMayor
