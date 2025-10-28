// 1. Importo las herramientas
// Necesito useContext y useMemo
import React, { useContext, useMemo } from 'react';

// 2. Importo el contexto de datos
import { PathsContext } from '../context/PathsContext';

// 3. Importo los estilos
import './Dashboard.css';

export default function Dashboard() {
  
  // 4. Me conecto al contexto y saco la lista de 'paths'
  const { paths } = useContext(PathsContext);

  // 5. ¡CÁLCULO OPTIMIZADO CON useMemo!
  // 'useMemo' "memoriza" el resultado de esta función.
  // Solo volverá a calcular las 'stats' si el array 'paths'
  // (que está en las dependencias [paths]) cambia.
  // ¡Esto evita cálculos innecesarios en cada re-render!
  const stats = useMemo(() => {
    const totalPaths = paths.length;
    let totalTasks = 0;
    let completedTasks = 0;

    // Recorro las rutas para sumar las tareas
    for (const path of paths) {
      totalTasks += path.tasks.length;
      completedTasks += path.tasks.filter(task => task.completed).length;
    }

    // Calculo el porcentaje (y evito dividir por cero)
    const completionPercentage = totalTasks === 0 
      ? 0 
      : Math.round((completedTasks / totalTasks) * 100);

    return {
      totalPaths,
      totalTasks,
      completedTasks,
      completionPercentage,
    };
  }, [paths]); // <- Array de dependencias

  // 6. OBTENGO LA LISTA DE TAREAS PENDIENTES
  // También con 'useMemo' para optimizar
  const pendingTasks = useMemo(() => {
    return paths.flatMap(path => 
      path.tasks
        // 1. Filtro solo las NO completadas
        .filter(task => !task.completed)
        // 2. Añado el nombre de la ruta a la tarea
        .map(task => ({ ...task, pathName: path.name }))
    );
  }, [paths]);


  // 7. Devuelvo el JSX (la interfaz)
  return (
    <div className="dashboard-container">
      <h1>Mi Dashboard (Centro de Progreso)</h1>

      {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Rutas Creadas</h3>
          <p className="stat-number">{stats.totalPaths}</p>
        </div>
        <div className="stat-card tasks">
          <h3>Tareas Totales</h3>
          <p className="stat-number">{stats.totalTasks}</p>
        </div>
        <div className="stat-card completed">
          <h3>Progreso General</h3>
          <p className="stat-number">{stats.completionPercentage}%</p>
        </div>
      </section>

      {/* --- SECCIÓN DE TAREAS PENDIENTES --- */}
      <section className="pending-tasks-container">
        <h2>Próximas Tareas Pendientes</h2>
        
        {pendingTasks.length === 0 ? (
          <p>¡Felicidades! No tienes tareas pendientes.</p>
        ) : (
          <div className="pending-task-list">
            {pendingTasks.map(task => (
              <div key={task.id} className="pending-task-item">
                <span className="task-name">{task.name}</span>
                <span className="path-name">{task.pathName}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}