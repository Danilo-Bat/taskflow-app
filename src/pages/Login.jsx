// 1. Importo las herramientas de React:
// - useContext: Para conectarme al AuthContext
// - useState: Para guardar lo que el usuario escribe
import React, { useContext, useState } from 'react';

// 2. Importo mi contexto de autenticación
import { AuthContext } from '../context/AuthContext';

// 3. Importo mis nuevos estilos
import './Login.css';

export default function Login() {
  
  // 4. Me conecto al AuthContext y saco la función 'login'
  const { login } = useContext(AuthContext);

  // 5. Creo los estados locales para los inputs
  // 'email' guardará el texto del campo de email
  // 'password' guardará el texto del campo de contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 6. Defino la función que se ejecutará al enviar el formulario
  const handleSubmit = (evento) => {
    // evento.preventDefault() evita que la página se recargue
    // (comportamiento por defecto de un formulario)
    evento.preventDefault();
    
    // ¡Llamo a la función 'login' de mi contexto!
    // Le paso el email y password que guardé en los estados.
    login(email, password);
  };

  // 7. Devuelvo el HTML (JSX) del formulario
  return (
    // 'className' es como 'class' en HTML, pero para React
    <div className="login-container">
      
      {/* Uso <form> y la conecto a mi función 'handleSubmit'
        con el evento 'onSubmit'
      */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Accede a TaskFlow</h1>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="tu@correo.com"
            // Conecto el valor del input a mi estado 'email'
            value={email}
            // Cada vez que el usuario escribe, actualizo el estado
            onChange={(e) => setEmail(e.target.value)}
            required // Hago que el campo sea obligatorio
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Tu contraseña"
            // Conecto el valor del input a mi estado 'password'
            value={password}
            // Cada vez que el usuario escribe, actualizo el estado
            onChange={(e) => setPassword(e.target.value)}
            required // Hago que el campo sea obligatorio
          />
        </div>

        <button type="submit" className="login-button">
          Ingresar
        </button>
      </form>

    </div>
  );
}