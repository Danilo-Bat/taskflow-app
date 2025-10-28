import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. ¡Importo el BrowserRouter!
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

// 2. Modifico el render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envuelvo mi <App /> con <BrowserRouter>
        Esto le da "poderes de ruteo" a toda mi aplicación.
     */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);