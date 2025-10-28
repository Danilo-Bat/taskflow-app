// 1. Importo las herramientas necesarias de React
import React, { createContext, useState } from 'react';

// 2. Creo el "molde" del contexto
export const AuthContext = createContext();

// 3. Creo el "Proveedor" (Provider) del contexto
export const AuthProvider = ({ children }) => {
  

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Intento leer mi 'token' (un simple 'true') del localStorage
    const storedAuth = localStorage.getItem('taskflowAuth');
    // Si existe y es 'true', retorno true. Si no, false.
    return storedAuth === 'true';
  });

  // 5. Defino las funciones que modificarán el estado
  
  // Función para iniciar sesión
  const login = (email, password) => {
    // (Aquí iría la lógica de validación real)
    console.log('Iniciando sesión con:', email, password);

   
    // Guardo en localStorage que el usuario SÍ está logueado.
    // 'taskflowAuth' es el nombre de mi "llave".
    // -----
    localStorage.setItem('taskflowAuth', 'true');
    
    // Y actualizo el estado en React (esto es lo que causa el re-render)
    setIsLoggedIn(true);
  };

  // Función para cerrar sesión
  const logout = () => {
    
  
    // Borro la "llave" del localStorage para invalidar la sesión.
    // -----
    localStorage.removeItem('taskflowAuth');
    
    // Y actualizo el estado en React
    setIsLoggedIn(false);
  };

  // 6. "Empaqueto" todo lo que quiero compartir
  const value = {
    isLoggedIn,
    login,
    logout,
  };

  // 7. Retorno el "Proveedor"
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};