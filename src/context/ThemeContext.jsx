import React, { createContext, useState, useEffect } from 'react';

// 1. Creo el "molde" del contexto
export const ThemeContext = createContext();

// 2. Defino el nombre de la llave en localStorage
const LOCAL_STORAGE_KEY = 'taskflowTheme';

// 3. Creo el Proveedor
export const ThemeProvider = ({ children }) => {
  
  // 4. Leo el estado inicial desde localStorage
  const [theme, setTheme] = useState(() => {
    // Primero, veo si el usuario ya guardó una preferencia
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    
    // Si no hay preferencia, uso la configuración de su Sistema Operativo
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // 5. EFECTO SECUNDARIO: Persistencia y cambio de clase
  useEffect(() => {
    // 1. Aplico/Quito la clase .dark del <body>
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // 2. Guardo la preferencia en localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error al guardar el tema en localStorage', error);
    }
  }, [theme]); // Se ejecuta cada vez que 'theme' cambia

  // 6. Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 7. Defino el valor del contexto
  const value = {
    theme,
    toggleTheme,
  };

  // 8. Retorno el proveedor
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};