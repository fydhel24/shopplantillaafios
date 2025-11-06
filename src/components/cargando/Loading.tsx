import React from 'react';
import { motion } from 'framer-motion'; // Importamos framer-motion para las animaciones

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
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
