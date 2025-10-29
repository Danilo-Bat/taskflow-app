// 1. Importo React, el hook para el contexto y NavLink
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importamos useNavigate

// 2. Importo el AuthContext para usar la función 'logout' Y el 'user'
import { AuthContext } from '../context/AuthContext';

// 3. Importo el ThemeToggle
import ThemeToggle from "./ThemeToggle/ThemeToggle.jsx"; // Ajusta la ruta si es necesario

// 4. Importo los estilos que crearemos ahora
import './Navbar.css';

export const Navbar = () => {
  // 5. Saco 'logout' y 'user' del contexto
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para redirigir

  // 6. Función de logout completa
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige al login tras cerrar sesión
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Este es el logo/título de la app */}
        <span className="navbar-brand">TaskFlow</span>

        {/* Links de navegación */}
        <div className="navbar-links">
          <NavLink 
            to="/manager" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Gestor de Rutas
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Resumen (Dashboard)
          </NavLink>
        </div>

        {/* Controles de la derecha */}
        <div className="navbar-controls">
          {/* Mostramos el email del usuario */}
          <span className="navbar-user-email">
            {user ? user.email : ''}
          </span>
          
          {/* Botón de Tema */}
          <ThemeToggle />

          {/* Botón de Logout */}
          <button onClick={handleLogout} className="logout-button-nav">
            Cerrar Sesión
          </button>
        </div>

      </div>
    </nav>
  );
};