import React, { createContext, useContext, useState, useEffect } from 'react';

// Definición de la interfaz para el contexto
interface AuthContextType {
  isActive: boolean;
  activateCode: () => void;
  deactivateCode: () => void;
  authorize: () => void;
}

// Creación del contexto sin permitir valores nulos
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(() => {
    // Recuperar el estado de localStorage al cargar la aplicación
    const storedState = localStorage.getItem('isActive');
    return storedState === 'true'; // Convertir string a boolean
  });

  const activateCode = () => {
    setIsActive(true);
    localStorage.setItem('isActive', 'true'); // Guardar en localStorage
  };

  const deactivateCode = () => {
    setIsActive(false);
    localStorage.setItem('isActive', 'false'); // Guardar en localStorage
  };

  const authorize = () => activateCode();

  useEffect(() => {
    // Configurar un temporizador para desactivar automáticamente después de 5 minutos
    let timeout: NodeJS.Timeout;
    if (isActive) {
      timeout = setTimeout(() => {
        deactivateCode();
      }, 5 * 60 * 1000); // 5 minutos
    }
    return () => clearTimeout(timeout);
  }, [isActive]);

  return (
    <AuthContext.Provider value={{ isActive, activateCode, deactivateCode, authorize }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
