import React from 'react';
import { motion } from 'framer-motion'; // Importamos framer-motion para las animaciones

// Importa la imagen que subiste (asumiré que la has colocado en la carpeta "assets")
import logo from './image.png'; 

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <motion.img 
        src={logo} 
        alt="Cargando..." 
        className="logo"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
      <motion.div 
        className="loading-text"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut"
 }}
      >
        Cargando...
      </motion.div>
    </div>
  );
};

export default Loading;
