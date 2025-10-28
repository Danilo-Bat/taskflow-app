// 1. Importo Suspense 
import React, { Suspense } from 'react';
// 2. Importo mi Router 
import { AppRouter } from './routes/AppRouter';
// 3. Importo mi AuthProvider 
import { AuthProvider } from './context/AuthContext';
// 4. ¡NUEVA IMPORTACIÓN! Importo mi PathsProvider
import { PathsProvider } from './context/PathsContext';

function App() {
  return (
    // 5. Envuelvo con AuthProvider (el más externo)
    <AuthProvider>
      
      {/* 6. Envuelvo con PathsProvider (el interno)
          De esta forma, cualquier componente dentro del Router
          tendrá acceso a AMBOS contextos (Auth y Paths).
      */}
      <PathsProvider>
        
        <Suspense fallback={<div>Cargando...</div>}>
          <AppRouter />
        </Suspense>

      </PathsProvider>
    
    </AuthProvider>
  );
}

export default App;