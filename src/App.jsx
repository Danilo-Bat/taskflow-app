import React, { Suspense } from 'react';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AppRouter />
    </Suspense>
  );
}

export default App;