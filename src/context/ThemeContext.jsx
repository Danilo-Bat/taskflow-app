import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const LOCAL_STORAGE_KEY = 'taskflowTheme';

export const ThemeProvider = ({ children }) => {
  
  // Intentamos cargar el tema guardado, si no existe usamos la preferencia del sistema
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    
    // Si no hay preferencia guardada, detectamos la del sistema operativo
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Aplicamos el tema al body y lo guardamos en localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error al guardar el tema en localStorage', error);
    }
  }, [theme]);

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};