// 1. Importo React, el hook para el contexto y NavLink
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

// 2. Importo el AuthContext para usar la función 'logout'
import { AuthContext } from '../context/AuthContext';

// 3. Importo los estilos que crearemos ahora
import './Navbar.css';

export const Navbar = () => {
  // 4. Saco la función 'logout' del contexto
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Este es el logo/título de la app */}
        <span className="navbar-brand">TaskFlow</span>

        {/* Links de navegación */}
        <div className="navbar-links">
          {/* Uso 'NavLink' en lugar de 'a' o 'Link'.
            'NavLink' es inteligente: añade la clase 'active'
            automáticamente al link de la página en la que estoy.
          */}
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

        {/* Botón de Logout */}
        <button onClick={logout} className="logout-button-nav">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};