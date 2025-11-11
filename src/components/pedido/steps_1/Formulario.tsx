import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import styles from "../../pedido/steps_1/form.module.css";
import Paso1 from "../../pedido/steps_1/Paso1";

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

const Formulario1 = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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

  const sendOrderToAPI = async () => {
    try {
      const apiFormData = new FormData();
      apiFormData.append("nombre", formData.nombre);
      apiFormData.append("ci", formData.ci);
      apiFormData.append("celular", formData.celular);
      apiFormData.append("destino", formData.departamento);
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
      generatePDF(pedidoNumero);
      handleRedirectToWhatsApp(pedidoNumero);
      setFormData(initialState);
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
    <div>
      <div className={styles.cinta}>
        Importadora Miranda - A un clic de tu producto
      </div>

      <div className={styles.formContainer}>
        <header className={styles.header}>
          <img
            src="/gg.png"
            alt="Logo Empresa Importadora Miranda"
            className={styles.logo}
          />
          <h1 className={styles.companyName}>PEDIDOS MIRANDA</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          <Paso1
            formData={formData}
            onChange={handleInputChange}
            formSubmitted={!!Object.keys(formErrors).length}
          />
          <button type="submit" className={styles.button}>
            Enviar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario1;
