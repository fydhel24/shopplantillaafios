import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../protec/AuthContext';
import { motion } from 'framer-motion';
import { Ticket, Shield, ChevronRight } from 'lucide-react';

const CatalogoMayoristas: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const { authorize } = useAuth();
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(e.target.value);
  };

  const validarCodigo = async () => {
    if (!codigo.trim()) {
      setMensaje('Por favor, ingresa un código válido.');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await axios.get('https://importadoramiranda.com/api/cupos');
      const cupones = response.data;

      const cuponValido = cupones.find(
        (cupon: any) => cupon.codigo === codigo && cupon.estado === 'Activo'
      );

      if (cuponValido) {
        authorize();
        navigate('/main');
      } else {
        setMensaje('Código no válido o inactivo.');
      }
    } catch (error) {
      setMensaje('Error al validar el código. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Generate animated particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-gray-800 text-white relative overflow-hidden">
      {/* Animated overlay pattern */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {particles.map(({ id, initialX, initialY, size, duration }) => (
        <motion.div
          key={id}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            width: size,
            height: size,
          }}
          initial={{ 
            x: `${initialX}vw`, 
            y: `${initialY}vh`,
            opacity: 0.1 
          }}
          animate={{
            x: [`${initialX}vw`, `${(initialX + 30) % 100}vw`],
            y: [`${initialY}vh`, `${(initialY + 30) % 100}vh`],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Main container */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg mx-auto"
          >
            {/* Header section */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 border border-white/20"
              >
                <img
                  className="w-12 h-12"
                  src="/logo.png" 
                  alt="logo"
                />
              </motion.div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Zona Mayorista
              </h1>
              <p className="text-xl text-red-100/80">Portal de Mayoristas</p>
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Login card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold">Acceso Exclusivo</h2>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                validarCodigo();
              }}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-red-100/80 mb-3">
                    Código de Mayorista
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300/60" />
                    <input
                      type="text"
                      value={codigo}
                      onChange={manejarCambio}
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-red-200/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300"
                      placeholder="Introduce tu código aquí"
                      required
                    />
                  </div>
                </div>

                {mensaje && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg"
                  >
                    <p className="text-sm text-red-200">{mensaje}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white rounded-xl py-4 px-6 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="ml-3">Validando acceso...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Ingresar al Portal</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </motion.button>
              </form>

              {/* Additional info */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-sm text-red-100/60">
                  Acceso exclusivo para socios mayoristas autorizados
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Image and decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden md:flex flex-col items-center justify-center relative"
          >
            {/* Decorative circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-96 h-96 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-80 h-80 rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Main image */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="relative z-10"
            >
              <img
                src="/Eerie__creepy_atmosphere._A_cute_girl_with_short_brown_hair__yellow_top__and_pink_pants__smiles__carrying_colorful_shopping_bags._Soft__minimalistic_background._Cartoonish_style__smooth_lines__pastel_.png"
                alt="Mayorista"
                className="max-w-sm object-contain filter drop-shadow-2xl"
              />
            </motion.div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-1/4 -left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="text-2xl font-bold text-red-300">24/7</div>
              <div className="text-xs text-white/70">Disponible</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute bottom-1/4 -right-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="text-2xl font-bold text-red-300">100%</div>
              <div className="text-xs text-white/70">Seguro</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CatalogoMayoristas;