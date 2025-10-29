import React, { useContext } from 'react';
// Ajusta la ruta si 'context' no está dos niveles arriba
import { ThemeContext } from '../../context/ThemeContext'; 
import { FaSun, FaMoon } from 'react-icons/fa'; // <-- Íconos
import './ThemeToggle.css'; // <-- Estilos para el botón

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      {/* Añadimos un <span> para que los íconos no "salten" */}
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;