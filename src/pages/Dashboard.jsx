// 1. Importo las herramientas
// Importamos useState y useEffect
import React, { useContext, useMemo, useState, useEffect } from 'react'; 

// 2. Importo el contexto de datos
import { PathsContext } from '../context/PathsContext';

// 3. Importo los estilos
import './Dashboard.css';

// Estado inicial para la animación
const initialStats = {
  totalPaths: 0,
  totalTasks: 0,
  completedTasks: 0,
  completionPercentage: 0,
  highPriorityPending: 0,
  mediumPriorityPending: 0,
  lowPriorityPending: 0,
};

export default function Dashboard() {
  
  const { paths } = useContext(PathsContext);
  const contextStats = useMemo(() => {
    const totalPaths = paths.length;
    let totalTasks = 0;
    let completedTasks = 0;

    for (const path of paths) {
      totalTasks += path.tasks.length;
      completedTasks += path.tasks.filter(task => task.completed).length;
    }

    const completionPercentage = totalTasks === 0 
      ? 0 
      : Math.round((completedTasks / totalTasks) * 100);

    const pendingTasks = paths.flatMap(path => 
      path.tasks.filter(task => !task.completed)
    );
    
    const highPriorityPending = pendingTasks.filter(t => t.priority === 'high').length;
    const mediumPriorityPending = pendingTasks.filter(t => t.priority === 'medium').length;
    const lowPriorityPending = pendingTasks.filter(t => t.priority === 'low' || !t.priority).length;

    return {
      totalPaths,
      totalTasks,
      completedTasks,
      completionPercentage,
      highPriorityPending,
      mediumPriorityPending,
      lowPriorityPending,
    };
  }, [paths]); 

  // 5. Estado local para manejar la animación
  const [animatedStats, setAnimatedStats] = useState(initialStats);
  
  useEffect(() => {
    // Cuando el componente carga o los stats del contexto cambian,
    // actualizamos el estado local. Esto dispara la transición CSS.
    // Usamos un pequeño timeout para asegurar que el DOM se pinte con 0s primero.
    const timer = setTimeout(() => {
      setAnimatedStats(contextStats);
    }, 50); // 50ms es suficiente
    
    return () => clearTimeout(timer); // Limpiamos el timer
  }, [contextStats]); // Depende de los stats reales

  // 6. OBTENGO LA LISTA DE TAREAS PENDIENTES
  const pendingTasks = useMemo(() => {
    return paths.flatMap(path => 
      path.tasks
        .filter(task => !task.completed)
        .map(task => ({ ...task, pathName: path.name }))
    );
  }, [paths]);


  // 7. Devuelvo el JSX usando 'animatedStats'
  return (
    <div className="dashboard-container">
      <h1>Mi Dashboard (Centro de Progreso)</h1>

      {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Rutas Creadas</h3>
          <p 
            className="stat-number" 
            style={{ "--num": animatedStats.totalPaths }}
          ></p>
        </div>
        <div className="stat-card tasks">
          <h3>Tareas Totales</h3>
          <p 
            className="stat-number" 
            style={{ "--num": animatedStats.totalTasks }}
          ></p>
        </div>
        <div className="stat-card completed">
          <h3>Progreso General</h3>
          <p 
            className="stat-number"
            style={{ "--num": animatedStats.completionPercentage }}
          ></p>
        </div>
        
        {/* --- Desglose de Prioridad --- */}
        <div className="stat-card priority-breakdown">
          <h3>Pendientes por Prioridad</h3>
          <div className="priority-item high">
            <span>Alta</span>
            <strong style={{ "--num": animatedStats.highPriorityPending }}></strong>
          </div>
          <div className="priority-item medium">
            <span>Media</span>
            <strong style={{ "--num": animatedStats.mediumPriorityPending }}></strong>
          </div>
          <div className="priority-item low">
            <span>Baja</span>
            <strong style={{ "--num": animatedStats.lowPriorityPending }}></strong>
          </div>
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