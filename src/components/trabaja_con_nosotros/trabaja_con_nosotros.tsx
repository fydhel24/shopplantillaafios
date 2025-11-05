"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

const SolicitudForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    ci: "",
    celular: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setMessage("Por favor, selecciona un archivo PDF.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("ci", formData.ci);
    data.append("celular", formData.celular);
    data.append("cv_pdf", cvFile);

    try {
      const response = await axios.post(
        "https://importadoramiranda.com/api/solicitudes",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("📦 Respuesta completa de la API:", response.data);

      const idSolicitud = response.data.data.id; // ← Corrección aquí

      // Resetear campos
      setFormData({ nombre: "", ci: "", celular: "" });
      setCvFile(null);
      const fileInput = document.getElementById("cv-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // 📲 Enviar mensaje a WhatsApp
      const whatsappNumber = "59170621016";
      const whatsappMessage =
        `Hola, me postulé a una oferta laboral en Importadora Miranda.\n` +
        `Mi nombre es: ${formData.nombre}\nCI: ${formData.ci}\nCelular: ${formData.celular}\n` +
        `ID de la solicitud: ${idSolicitud}`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappURL, "_blank");

      // 🔁 Redirigir al home después de abrir WhatsApp
      window.location.href = "/";
    } catch (error: any) {
      setMessage("❌ Error al enviar la solicitud.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-xl mt-32">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">
        Trabaja con Nosotros
      </h2>
      <p className="text-gray-600 mb-6">
        Completa el siguiente formulario para postularte.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CI</label>
          <input
            type="text"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Celular
          </label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currículum (PDF)
          </label>
          <div className="relative">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
              <input
                type="file"
                id="cv-file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-purple-700">
                  {cvFile ? cvFile.name : "Haz clic para seleccionar tu CV"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {cvFile
                    ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "Solo archivos PDF"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-700 text-white py-3 px-4 rounded-lg hover:bg-purple-800 transition mt-6 font-medium"
        >
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default SolicitudForm;
