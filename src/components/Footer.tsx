import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 md:px-12 bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-700 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Información de la empresa */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-wide">ELITCODE S.A</h2>
          <p className="text-gray-600 text-sm">Av. Buenos Aires 122, La Paz, Bolivia</p>
          <p className="text-gray-600 text-sm">Lunes a Sábado: 09:00 a.m. - 08:00 p.m.</p>
          <p className="text-gray-600 text-sm">Teléfono: +591 70621016</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="text-center">
          <h3 className="text-md font-semibold text-gray-900 mb-2">Enlaces Rápidos</h3>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-gray-900 transition">Inicio</a></li>
            <li><a href="#" className="hover:text-gray-900 transition">Productos</a></li>
            <li><a href="#" className="hover:text-gray-900 transition">Servicios</a></li>
            <li><a href="#" className="hover:text-gray-900 transition">Contacto</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center md:justify-end space-x-4">
          <a
            href="#"
            className="text-gray-500 hover:text-blue-600 transition transform hover:scale-110"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-pink-600 transition transform hover:scale-110"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-800 transition transform hover:scale-110"
          >
            <FaTiktok size={20} />
          </a>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="border-t border-gray-200 mt-6 pt-4 text-center">
        <p className="text-xs text-gray-500">
          © 2024 <span className="font-semibold text-gray-800">ELITCODE S.A</span>. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
