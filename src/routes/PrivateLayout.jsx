import React from 'react';
// 'Outlet' es un componente especial de react-router-dom
// que renderiza el "componente hijo" (la página).
import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/Navbar';

// Este es un "Layout Component". Su trabajo es
// renderizar una estructura común (la Navbar) y
// luego renderizar la página que corresponda (el Outlet).
export const PrivateLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Aquí es donde React Router renderizará
            TaskManager o Dashboard
        */}
        <Outlet /> 
      </main>
    </>
  );
};