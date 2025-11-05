import React, { useEffect, useRef } from "react";
import L from "leaflet";

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  referencia: string;
  lat: number;
  lng: number;
}

const SucursalesSection: React.FC = () => {
  const sucursal: Sucursal = {
    id: 2,
    nombre: "Importadora Zona Mayorista",
    direccion: "Plaza Bonita local 13",
    referencia: "Cerca al puente Vita, Av. Buenos Aires",
    lat: -16.493553526008537,
    lng: -68.1443435673565,
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const leafletCss = document.createElement("link");
        leafletCss.rel = "stylesheet";
        leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        leafletCss.integrity =
          "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        leafletCss.crossOrigin = "";
        document.head.appendChild(leafletCss);
      }

      const map = L.map(mapRef.current).setView(
        [sucursal.lat, sucursal.lng],
        17
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="width: 36px; height: 36px; border-radius: 50%; background-color: #ef4444; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 0 6px rgba(0,0,0,0.5);">${String.fromCharCode(
          64 + sucursal.id
        )}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([sucursal.lat, sucursal.lng], { icon }).addTo(
        map
      );
      marker
        .bindPopup(
          `<strong>${sucursal.nombre}</strong><br/>${sucursal.direccion}`
        )
        .openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-red-900 via-red-700 to-gray-800 text-white font-['Inter',_'SF_Pro_Display',_system-ui,_sans-serif] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14 drop-shadow-lg tracking-tight">
          Visítanos en nuestra ubicación
        </h2>

        {/* Contenedor de tarjeta + mapa */}
        <div className="flex flex-col lg:flex-row gap-10 items-center bg-white rounded-3xl shadow-2xl p-8 text-gray-800">
          {/* Tarjeta informativa */}
          <div className="w-full text-center">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                {String.fromCharCode(64 + sucursal.id)}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{sucursal.nombre}</h3>
                <p className="text-gray-600 text-base">{sucursal.direccion}</p>
              </div>
            </div>
            {sucursal.referencia && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Referencia:</span>{" "}
                {sucursal.referencia}
              </p>
            )}
          </div>

          {/* Mapa */}
            <div ref={mapRef} className="h-96 z-0" />
        </div>
      </div>
    </section>
  );
};

export default SucursalesSection;
