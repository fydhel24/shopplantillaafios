// MoleculeBackground.jsx
import React from 'react';
import ParticlesBg from 'particles-bg';

const MoleculeBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: '-1',
        backgroundColor: '#FFFFFF', // Fondo blanco
      }}
    >
      <ParticlesBg 
        type="cobweb" 
        color="#e3b1d2" // Partículas en gris claro con más transparencia
        bg={true} 
      />
    </div>
  );
};

export default MoleculeBackground;
