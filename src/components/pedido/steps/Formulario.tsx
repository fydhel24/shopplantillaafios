import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Paso1 from "../../pedido/steps/Paso1";
import { motion } from "framer-motion";

// Definir un tipo para formData
interface FormData {
  nombre: string;
  ci: string;
  celular: string;
  departamento: string;
  provincia: string;
}

const initialState: FormData = {
  nombre: "",
  ci: "",
  celular: "",
  departamento: "",
  provincia: "",
};

const Formulario = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [pedidoMessage, setPedidoMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.nombre.trim())
      errors.nombre = "Por favor, ingrese su nombre.";
    if (!formData.ci.trim())
      errors.ci = "Por favor, ingrese su cédula de identidad.";
    if (!formData.celular.trim())
      errors.celular = "Por favor, ingrese su número de celular.";
    if (!formData.departamento.trim())
      errors.departamento = "Por favor, seleccione un departamento.";
    if (!formData.provincia.trim())
      errors.provincia = "Por favor, seleccione una provincia.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      await sendOrderToAPI();
    }
  };
  const abreviacionesDepartamentos: { [key: string]: string } = {
    "Santa Cruz": "SCZ",
    "La Paz": "LPZ",
    Cochabamba: "CBB",
    Potosí: "PTS",
    Oruro: "ORU",
    Chuquisaca: "CHU",
    Tarija: "TJA",
    Beni: "BEN",
    Pando: "PAN",
  };

  const sendOrderToAPI = async () => {
    try {
      const apiFormData = new FormData();

      // Obtener el departamento y la provincia por separado
      const [departamentoCompleto, provincia] =
        formData.departamento.split(" - ");

      // Obtener la abreviatura del departamento
      const abreviatura =
        abreviacionesDepartamentos[departamentoCompleto] ||
        departamentoCompleto;

      // Armar el destino abreviado
      const destinoAbreviado = `${abreviatura} - ${provincia}`;

      apiFormData.append("nombre", formData.nombre);
      apiFormData.append("ci", formData.ci);
      apiFormData.append("celular", formData.celular);
      apiFormData.append("destino", destinoAbreviado);
      apiFormData.append("direccion", "Sin direccion");
      apiFormData.append("estado", "POR COBRAR");
      apiFormData.append("cantidad_productos", "0");
      apiFormData.append("detalle", "Sin Detalle");
      apiFormData.append("productos", JSON.stringify([]));
      apiFormData.append("monto_deposito", "0");
      apiFormData.append("monto_enviado_pagado", "0");
      apiFormData.append("id_usuario", "0");

      const apiResponse = await axios.post(
        "https://afios.miracode.tech/api/pedidos/lupenuevo",
        apiFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const pedidoNumero = apiResponse.data.message;
      setPedidoMessage(pedidoNumero);
      setFormData(initialState);
      generatePDF(pedidoNumero);
      handleRedirectToWhatsApp(pedidoNumero);
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
    }
  };

  const generatePDF = (pedidoMessage: string): void => {
    const date = new Date().toLocaleString();
    const doc = new jsPDF();

    doc.setFillColor(128, 0, 128);
    doc.rect(10, 10, 190, 15, "F");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("CONFIRMACIÓN DE COMPRA", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha y Hora: ${date}`, 10, 30);
    doc.setFillColor(230, 230, 250);
    doc.rect(10, 35, 190, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(75, 0, 130);
    doc.text("DETALLES DEL CLIENTE", 105, 42, { align: "center" });
    doc.setTextColor(50, 50, 50);
    doc.text(`Número de Pedido: ${pedidoMessage}`, 10, 50);
    doc.text(`Nombre: ${formData.nombre}`, 10, 60);
    doc.text(`CI: ${formData.ci}`, 10, 70);
    doc.text(`Celular: ${formData.celular}`, 10, 80);
    doc.setFillColor(230, 230, 250);
    doc.rect(10, 95, 190, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(75, 0, 130);
    doc.text("INFORMACIÓN DE ENVÍO", 105, 102, { align: "center" });
    doc.setTextColor(50, 50, 50);
    doc.text(`Provincia o Departamento: ${formData.departamento}`, 10, 110);
    doc.setFontSize(14);
    doc.setTextColor(128, 0, 128);
    doc.text(
      "Para confirmar completamente el pedido y saber más detalles,",
      10,
      130,
      { maxWidth: 190 }
    );
    doc.text("envíe un mensaje a nuestro WhatsApp.", 10, 140, {
      maxWidth: 190,
    });
    doc.setFontSize(16);
    doc.setTextColor(75, 0, 130);
    doc.text("WhatsApp: +591 70621016", 105, 155, { align: "center" });
    doc.save(`Confirmación_de_Compra_${pedidoMessage}.pdf`);
  };

  const handleRedirectToWhatsApp = (pedidoMessage: string): void => {
    const mensaje = `Hola, soy ${formData.nombre} y mi número de pedido es ${pedidoMessage}, soy de: ${formData.departamento}. Me gustaría confirmar mi pedido y conocer más detalles.`;
    const enlaceWhatsApp = `https://wa.me/59170621016?text=${encodeURIComponent(
      mensaje
    )}`;
    window.location.href = enlaceWhatsApp;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-cyan-900 via-cyan-700 to-gray-800 text-white relative overflow-hidden">
      {/* Estilos CSS para la animación de burbujas */}
      <style>{`
        .bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .bubbles li {
          position: absolute;
          display: block;
          list-style: none;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          animation: animate 25s linear infinite;
          bottom: -150px;
          border-radius: 50%;
        }

        .bubbles li:nth-child(1) {
          left: 25%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }

        .bubbles li:nth-child(2) {
          left: 10%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        .bubbles li:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }

        .bubbles li:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        .bubbles li:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }

        .bubbles li:nth-child(6) {
          left: 75%;
          width: 110px;
          height: 110px;
          animation-delay: 3s;
        }

        .bubbles li:nth-child(7) {
          left: 35%;
          width: 150px;
          height: 150px;
          animation-delay: 7s;
        }

        .bubbles li:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        .bubbles li:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        .bubbles li:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }

        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
      `}</style>

      {/* Contenedor de burbujas */}
      <ul className="bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-0 w-full max-w-xl p-8 bg-gray-900/40 rounded-3xl shadow-2xl backdrop-blur-md border border-gray-700 relative z-20"
      >
        <header className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo.png"
            alt="Logo Empresa Importadora Miranda"
            className="w-24 h-24 mb-4 object-contain rounded-full border-2 border-cyan-500 shadow-md"
          />
          <h1 className="text-2xl sm:text-2xl font-extrabold tracking-tight text-cyan-400">
            Pedidos Miracode Technology
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Paso1
            formData={formData}
            onChange={handleInputChange}
            formSubmitted={!!Object.keys(formErrors).length}
          />
          {formErrors.nombre && (
            <p className="text-cyan-300 text-sm">{formErrors.nombre}</p>
          )}
          {formErrors.ci && (
            <p className="text-cyan-300 text-sm">{formErrors.ci}</p>
          )}
          {formErrors.celular && (
            <p className="text-cyan-300 text-sm">{formErrors.celular}</p>
          )}
          {formErrors.departamento && (
            <p className="text-cyan-300 text-sm">{formErrors.departamento}</p>
          )}
          {formErrors.provincia && (
            <p className="text-cyan-300 text-sm">{formErrors.provincia}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyanj-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg"
          >
            Enviar Pedido
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Formulario;
