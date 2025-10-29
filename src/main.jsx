import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Tu index.css actualizado
import { BrowserRouter } from 'react-router-dom'

// 1. Importamos todos los proveedores
import { AuthProvider } from './context/AuthContext.jsx'
import { PathsProvider } from './context/PathsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx' // <-- ¡NUEVO!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos todo. ThemeProvider va por fuera 
           para que toda la app reciba las variables CSS. */}
    <ThemeProvider>
      <AuthProvider>
        <PathsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PathsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)