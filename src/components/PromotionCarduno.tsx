import React, { useState, useEffect } from "react"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useNavigate, Link } from "react-router-dom"
import { AiOutlineArrowRight as AiRightIcon } from "react-icons/ai"

type Producto = {
  id: number
  nombre: string
  cantidad: number
  fotos: string[]
}

type Promocion = {
  id: number
  nombre: string
  precio_promocion: string
  productos: Producto[]
}

const PromocionesCarduno: React.FC = () => {
  const navigate = useNavigate()
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await axios.get("https://afios.miracode.tech/api/promociones")
        setPromociones(response.data.promociones)
      } catch {
        setError("Error al cargar las promociones.")
      } finally {
        setLoading(false)
      }
    }
    fetchPromociones()
  }, [])

  const navigateToDetails = (promocion: Promocion) => {
    navigate(`/promocion/${promocion.id}`)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-emerald-400"></div>
    </div>
  )

  if (error) return (
    <div className="text-center text-red-500 py-10">
      {error}
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-blue-900 via-sky-800 to-emerald-700 p-6 md:p-12 text-white">
      <h1
        className="text-center mb-10 text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-400 font-serif drop-shadow-md"
      >
        Promociones Especiales
      </h1>

      {/* Desktop View */}
      <div className="hidden md:block relative">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={3}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation]}
        >
          {promociones.map((promo) => {
            const imageUrl = promo.productos[0]?.fotos[0]
              ? `https://afios.miracode.tech/storage/${promo.productos[0].fotos[0]}`
              : "/placeholder.svg"

            return (
              <SwiperSlide key={promo.id}>
                <div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 cursor-pointer text-gray-800"
                  onClick={() => navigateToDetails(promo)}
                >
                  <img
                    src={imageUrl}
                    alt={promo.nombre}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-center line-clamp-2">
                      {promo.nombre}
                    </h2>
                    <p className="text-center text-emerald-600 font-extrabold text-2xl">
                      Bs {promo.precio_promocion}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        <div className="swiper-button-prev absolute top-1/2 left-0 z-10 bg-white text-emerald-600 p-2 rounded-full shadow-md -translate-y-1/2" />
        <div className="swiper-button-next absolute top-1/2 right-0 z-10 bg-white text-emerald-600 p-2 rounded-full shadow-md -translate-y-1/2" />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={1}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
        >
          {promociones.map((promo) => {
            const imageUrl = promo.productos[0]?.fotos[0]
              ? `https://afios.miracode.tech/storage/${promo.productos[0].fotos[0]}`
              : "/placeholder.svg"

            return (
              <SwiperSlide key={promo.id}>
                <div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 cursor-pointer text-gray-800"
                  onClick={() => navigateToDetails(promo)}
                >
                  <img
                    src={imageUrl}
                    alt={promo.nombre}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-bold mb-2 text-center line-clamp-2">
                      {promo.nombre}
                    </h2>
                    <p className="text-center text-emerald-600 font-bold text-xl">
                      Bs {promo.precio_promocion}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {/* Ver más promociones */}
      <div className="flex justify-center mt-10">
        <Link
          to="/promociones"
          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full shadow-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600"
        >
          <span className="absolute inset-0 flex items-center justify-center transition-transform transform translate-x-full group-hover:translate-x-0 ease-in-out duration-300">
            <AiRightIcon className="w-5 h-5" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full transition-transform transform group-hover:-translate-x-full ease-in-out duration-300">
            Ver todas las promociones
          </span>
          <span className="relative invisible">Ver todas las promociones</span>
        </Link>
      </div>

      <style>{`
        .swiper-button-prev::after,
        .swiper-button-next::after {
          content: '';
        }

        .swiper-button-prev,
        .swiper-button-next {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export default PromocionesCarduno
