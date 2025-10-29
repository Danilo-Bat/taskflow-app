import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  
  const { login, register } = useContext(AuthContext);

  // Estado para alternar entre login y registro
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado para mensajes de error
  const [error, setError] = useState('');

  // Función para limpiar el formulario
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Función para alternar entre modos
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  // Manejar el envío del formulario
  const handleSubmit = (evento) => {
    evento.preventDefault();
    setError('');

    if (isRegistering) {
      // Validaciones para registro
      if (name.trim().length < 2) {
        setError('El nombre debe tener al menos 2 caracteres');
        return;
      }

      if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres');
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      // Intentar registrar
      const result = register(name, email, password);
      
      if (!result.success) {
        setError(result.error);
      }
    } else {
      // Intentar iniciar sesión
      const result = login(email, password);
      
      if (!result.success) {
        setError(result.error);
      }
    }
  };

  return (
    <div className="login-container">
      
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>{isRegistering ? 'Crear Cuenta' : 'Accede a TaskFlow'}</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isRegistering && (
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder={isRegistering ? "Mínimo 4 caracteres" : "Tu contraseña"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegistering && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="login-button">
          {isRegistering ? 'Crear Cuenta' : 'Ingresar'}
        </button>

        <div className="toggle-mode">
          <p>
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleMode}
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </form>

    </div>
  );
}