import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../protec/AuthContext";
import { motion } from "framer-motion";
import { Ticket, Shield, ChevronRight } from "lucide-react";

const CatalogoMayoristas: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const { authorize } = useAuth();
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(e.target.value);
  };

  const validarCodigo = async () => {
    if (!codigo.trim()) {
      setMensaje("Por favor, ingresa un código válido.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const response = await axios.get(
        "https://afios.miracode.tech/api/cupos"
      );
      const cupones = response.data;

      const cuponValido = cupones.find(
        (cupon: any) => cupon.codigo === codigo && cupon.estado === "Activo"
      );

      if (cuponValido) {
        authorize();
        navigate("/main");
      } else {
        setMensaje("Código no válido o inactivo.");
      }
    } catch (error) {
      setMensaje("Error al validar el código. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 md:px-12">
      {/* CARD CENTRAL */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-gray-50 rounded-3xl shadow-xl border border-gray-200 p-10"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6 shadow-inner"
          >
            <img className="w-12 h-12" src="/logo.png" alt="logo" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Miracode Technology
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Portal de acceso exclusivo
          </p>
          <div className="w-16 h-1 bg-cyan-600 rounded-full mx-auto mt-3"></div>
        </div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-cyan-600 mr-3" />
            <h2 className="text-2xl font-semibold">Acceso Exclusivo</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              validarCodigo();
            }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Mayorista
              </label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={codigo}
                  onChange={manejarCambio}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                  placeholder="Introduce tu código aquí"
                  required
                />
              </div>
            </div>

            {mensaje && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-cyan-300 rounded-lg"
              >
                <p className="text-sm text-cyan-700">{mensaje}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-4 px-6 font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group disabled:opacity-50"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="ml-3">Validando acceso...</span>
                </div>
              ) : (
                <>
                  <span>Ingresar al Portal</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Acceso exclusivo para socios mayoristas autorizados
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CatalogoMayoristas;
