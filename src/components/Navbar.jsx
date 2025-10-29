import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle/ThemeToggle.jsx';
import './Navbar.css';

export const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-brand">TaskFlow</span>

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
            Dashboard
          </NavLink>
        </div>

        <div className="navbar-controls">
          {user && (
            <div className="navbar-user-info" title={user.email}>
              <FaUser className="navbar-user-icon" />
              <span className="navbar-user-email-text">
                {user.email.split('@')[0]}
              </span>
            </div>
          )}
          
          <ThemeToggle />

          <button onClick={handleLogout} className="logout-button-nav">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};