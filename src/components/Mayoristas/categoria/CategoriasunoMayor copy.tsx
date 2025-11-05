"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, EffectCoverflow } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/effect-coverflow"
import { useNavigate } from "react-router-dom"

interface Product {
  id: number
  nombre: string
  precio: string
  precio_extra: string
  created_at: string
  fotos: Array<{
    id: number
    foto: string
    pivot: {
      id_producto: number
      id_foto: number
    }
  }>
}

interface Category {
  id: number
  categoria: string
  created_at: string
  productos: Product[]
}

const CategoriasUnoMayor: React.FC = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://importadoramiranda.com/api/lupe/categorias?sort=created_at&order=desc",
        )

        console.log("Datos sin procesar:", data)

        const processedCategories = data.map((category: Category) => ({
          ...category,
          productos: category.productos
            .filter((producto) => producto.created_at) // Filtrar productos sin fecha
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 4), // Tomar solo los 4 más recientes
        }))

        setCategories(processedCategories)
      } catch (err) {
        setError("No se pudieron cargar las categorías.")
        console.error("Error al cargar categorías:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/categoriamayor/${categoryName}`)
  }

  if (loading) return <div className="text-center py-10">Cargando categorías...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <section className="py-10 px-4 md:px-8 lg:px-16 relative min-h-screen bg-transparent">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-white mb-8">
          Explora Nuestras Categorías
        </h2>

        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="mySwiper"
        >
          {categories.map(({ id, categoria, productos }) => (
            <SwiperSlide key={id}>
              <div
                className="cursor-pointer transform hover:scale-105 transition-all duration-300 h-[500px] md:h-[600px] flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
                onClick={() => handleCategoryClick(categoria)}
              >
                <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-4">
                  <h3 className="text-xl md:text-2xl font-bold text-center">{categoria}</h3>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {productos.map((producto) => (
                      <div key={producto.id} className="relative group product">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          {producto.fotos.length > 0 ? (
                            <img
                              src={`https://importadoramiranda.com/storage/${producto.fotos[0].foto}`}
                              alt={producto.nombre}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <h4 className="mt-2 text-sm font-medium text-gray-900 truncate">{producto.nombre}</h4>
                        <p className="text-sm font-bold text-blue-600">Bs.{producto.precio_extra}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center mt-8">
          <button
            className="bg-gradient-to-r from-blue-600 to-sky to-blue-900-600 text-white py-2 px-4 rounded-full hover:from-blue-700 hover:to-blue-700 transition-all duration-300 flex items-center"
            onClick={() => (window.location.href = "/categoriamayor")}
          >
            <span>Ver más categorías</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #8b5cf6;
          background-color: rgba(255, 255, 255, 0.8);
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
        }

        .product {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 15px;
          border-radius: 12px;
          background-color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .product:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        @media (hover: none) and (pointer: coarse) {
          .product {
            touch-action: pan-y;
          }
        }

        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default CategoriasUnoMayor

