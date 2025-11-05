import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/carrito/CarritoContext';
import Paso1 from './Paso11';
import Paso2 from './Paso21';
import { styles } from './Styles1';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const Index: React.FC = () => {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [departamentoProvincia, setDepartamentoProvincia] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('recoger'); // Ejemplo: recoger, avion, terrestre
  const [ciudad, setCiudad] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { cartItems, clearCart } = useCart(); // Accedemos al carrito
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.quantity * (item.customPrice ?? item.price)),
      0
    );
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nombre) newErrors.nombre = 'Nombre es obligatorio';
    if (!ci) newErrors.ci = 'CI es obligatorio';
    if (!celular) newErrors.celular = 'Celular es obligatorio';
    if (!departamentoProvincia) newErrors.departamentoProvincia = 'Departamento y Provincia son obligatorios';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 2 && !validateStep2()) return;
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Llamar a la función de enviar pedido
      sendOrderToAPI();
    }
  };

  const sendOrderToAPI = async () => {
    try {
      // Detalles del pedido
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const detalle = cartItems.map((item) => `${item.name} - Cantidad: ${item.quantity}`).join('; ');
      const productosArray = cartItems.map((item) => ({
        id_producto: item.id,
        cantidad: item.quantity,
        precio: item.customPrice ?? item.price,
      }));

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('ci', ci);
      formData.append('celular', celular);
      formData.append('destino', departamentoProvincia);
      formData.append('direccion', 'Sin direccion'); // No usamos dirección, pero API lo necesita
      formData.append('estado', 'POR COBRAR');
      formData.append('codigo', 'Mayorista'); // No usamos dirección, pero API lo necesita
      formData.append('cantidad_productos', totalQuantity.toString());
      formData.append('detalle', detalle);
      formData.append('productos', JSON.stringify(productosArray));
      formData.append('monto_deposito', calculateTotal().toString());
      formData.append('monto_enviado_pagado', '0'); // Suponiendo que no hay envío
      formData.append('id_usuario', '1');
      formData.append('foto_comprobante', ''); // Cadena vacía

      // Enviar datos a la API
      const response = await axios.post('https://www.importadoramiranda.com/api/pedidos/lupenuevo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { message } = response.data;
      console.log('Número de pedido:', message);

      // Generar PDF y enviar WhatsApp
      generatePDF(message);
      sendWhatsAppMessage(message);

      // Limpiar el formulario y el carrito
      clearCart();
      resetForm();

      // Redirigir a la página principal
      navigate('/');
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    }
  };

  const generatePDF = (pedidoMessage: string) => {
    const date = new Date().toLocaleString();
    const doc = new jsPDF();
  
    // Colores personalizados más suaves
    const primaryColor = '#8E6BB0';  // Lavanda suave
    const secondaryColor = '#F0EBF4';  // Lila muy claro
    const textColor = '#333333';  // Gris oscuro para el texto
    const highlightColor = '#6B4E84';  // Púrpura más oscuro para resaltar
  
    // Función para crear encabezados de sección
    const createSectionHeader = (text: string, y: number) => {
      doc.setFillColor(primaryColor);
      doc.rect(10, y, 190, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(text, 15, y + 6);
      return y + 12;
    };
  
    // Función para agregar texto con fondo alternado
    const addTextWithBackground = (texts: string[], startY: number, lineHeight: number = 7) => {
      texts.forEach((text, index) => {
        const y = startY + index * lineHeight;
        if (index % 2 === 0) {
          doc.setFillColor(secondaryColor);
          doc.rect(10, y - 4, 190, lineHeight, 'F');
        }
        doc.setTextColor(textColor);
        doc.text(text, 15, y);
      });
      return startY + texts.length * lineHeight;
    };
  
    // Encabezado del Documento
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Confirmación de Pedido', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha y Hora: ${date}`, 105, 25, { align: 'center' });
  
    let yPos = 40;
  
    // Detalles del Cliente
    yPos = createSectionHeader('Detalles del Cliente', yPos);
    yPos = addTextWithBackground([
      `Número de Pedido: ${pedidoMessage}`,
      `Nombre: ${nombre}`,
      `CI: ${ci}`,
      `Celular: ${celular}`,
      `Departamento y Provincia: ${departamentoProvincia}`,
    ], yPos);
  
    yPos += 5;
  
    // Detalles de los productos
    yPos = createSectionHeader('Detalles de los Productos', yPos);
    doc.setFillColor(primaryColor);
    doc.rect(10, yPos, 190, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Producto', 15, yPos + 5);
    doc.text('Cantidad', 120, yPos + 5);
    doc.text('Precio Total', 160, yPos + 5);
    yPos += 10;
  
    cartItems.forEach((item, index) => {
      // Verificar si se necesita nueva página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      if (index % 2 === 0) {
        doc.setFillColor(secondaryColor);
        doc.rect(10, yPos - 4, 190, 7, 'F');
      }
      
      doc.setTextColor(textColor);
      doc.text(item.name, 15, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      const itemTotal = ((item.customPrice ?? item.price) * item.quantity - (item.discount ?? 0)).toFixed(2);
      doc.text(`Bs. ${itemTotal}`, 160, yPos);
      yPos += 7;
    });
  
    // Resumen de Pago
    yPos = createSectionHeader('Resumen de Pago', yPos);
    yPos = addTextWithBackground([
      `Total Productos con Descuento: Bs. ${calculateTotal().toFixed(2)}`,
      `Total a Pagar: Bs. ${calculateTotal().toFixed(2)}`
    ], yPos);
  
    yPos += 10;
  
    // Nota Final
    doc.setTextColor(highlightColor);
    doc.setFontSize(10);
    const noteText = 'Gracias por su pedido. Envíe un mensaje a WhatsApp para verificar disponibilidad y completar la compra.';
    const splitText = doc.splitTextToSize(noteText, 180);
    
    // Verificar el espacio para la nota y hacer un salto si es necesario
    if (yPos + splitText.length * 6 > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(splitText, 105, yPos, { align: 'center' });
  
    // Guardar el PDF
    doc.save('Confirmación_de_Pedido.pdf');
  };
  
  

  const sendWhatsAppMessage = (pedidoMessage: string) => {
    const message = `¡Hola, Importadora Miranda! Este es el pedido que hice desde tu tienda online, porfabor puede verificar los productos disponibles:\n` +
      `Número de Pedido: ${pedidoMessage}\n` +
      `Nombre: ${nombre}\n` +
      `CI: ${ci}\n` +
      `Celular: ${celular}\n` +
      `Departamento y Provincia: ${departamentoProvincia}\n` +
      `Productos:\n${cartItems.map((item) => `${item.name} - Cantidad: ${item.quantity}`).join('\n')}\n` +
      `Total a Pagar: Bs. ${calculateTotal().toFixed(2)}`;
  
      const phoneNumber = '59170621016';
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
      window.open(whatsappURL, '_blank'); // Abre en una nueva pestaña
  };
  

  const resetForm = () => {
    setNombre('');
    setCi('');
    setCelular('');
    setDepartamentoProvincia('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Formulario de Compra</h1>

      <div style={styles.progressBar}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              ...styles.progressStep,
              ...(step >= s ? styles.progressStepActive : {}),
            }}
          >
            {s}
          </div>
        ))}
      </div>

      <div style={styles.form}>
        {step === 1 && <Paso1 />}
        {step === 2 && (
          <Paso2 
          nombre={nombre}
          setNombre={setNombre}
          ci={ci}
          setCi={setCi}
          celular={celular}
          setCelular={setCelular}
          departamentoMunicipio={departamentoProvincia} // <-- Cambiado
          setDepartamentoMunicipio={setDepartamentoProvincia} // <-- Cambiado
          errors={errors}
        />
        
        )}

        <div style={styles.buttonContainer}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={styles.button}>
              Anterior
            </button>
          )}
          <button onClick={handleNextStep} style={styles.buttonPrimary}>
            {step === 2 ? 'Finalizar y enviar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
