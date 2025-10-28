// 1. Importo las herramientas 
import React, { lazy, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 2. Importo el AuthContext 
import { AuthContext } from '../context/AuthContext';

// 3. Importo mi nuevo Layout
import { PrivateLayout } from './PrivateLayout';

// 4. Importo las páginas con lazy
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TaskManager = lazy(() => import('../pages/TaskManager'));

// 5. Defino mi componente de rutas
export const AppRouter = () => {
  
  const { isLoggedIn } = useContext(AuthContext);

  // 6. Retorno las rutas con LÓGICA CONDICIONAL
  return (
    <Routes>
      
      {/* RUTAS PÚBLICAS (Si NO estoy logueado) */}
      {!isLoggedIn && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* RUTAS PRIVADAS (Si SÍ estoy logueado) */}
      {isLoggedIn && (
        // Le digo que RENDERICE el componente 'PrivateLayout'
        // para TODAS las rutas privadas.
        <Route path="/" element={<PrivateLayout />}>
          
          {/* Estas son las "rutas hijas" (children) que
              se renderizarán DENTRO del <Outlet> del layout
          */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manager" element={<TaskManager />} />

          {/* Si estoy logueado e intento ir a CUALQUIER OTRA RUTA... 
              Lo mando al manager.
          */}
          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Route>
      )}
      
    </Routes>
  );
};