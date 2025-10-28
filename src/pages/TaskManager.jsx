// 1. Importo las herramientas
import React, { useContext, useState } from 'react';

// 2. Importo AMBOS contextos
import { AuthContext } from '../context/AuthContext'; // <- Se borró en el paso 10, lo ignoro
import { PathsContext } from '../context/PathsContext';

// 3. Importo mis estilos
import './TaskManager.css';


// 4. --- (INICIO) SUB-COMPONENTE: PathCard ---
const PathCard = ({ path }) => {
  // 4a. Saco las nuevas funciones del contexto
  const { addTaskToPath, toggleTaskStatus, deleteTask, deletePath } = useContext(PathsContext);
  
  const [taskName, setTaskName] = useState('');

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    addTaskToPath(path.id, taskName);
    setTaskName(''); 
  };

  // 4b. Función de confirmación para borrar ruta
  const handleDeletePath = () => {
    // Usamos 'confirm' de JavaScript para una verificación simple
    // Es una forma rápida y optimizada de evitar borrados accidentales
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la ruta "${path.name}"? Esta acción no se puede deshacer.`
    );
    
    if (isConfirmed) {
      deletePath(path.id);
    }
  };


  return (
    <div className="path-card">
      <h2>{path.name}</h2>
      
      {/* Formulario para añadir TAREAS */}
      <form className="task-form" onSubmit={handleTaskSubmit}>
        <input 
          type="text"
          placeholder="Nueva tarea (Ej: Aprender useState)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <button type="submit">Añadir</button>
      </form>
      
      {/* Lista de Tareas */}
      <div className="task-list">
        {path.tasks.length === 0 ? (
          <p>No hay tareas en esta ruta.</p>
        ) : (
          path.tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <input 
                type="checkbox" 
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => toggleTaskStatus(path.id, task.id)}
              />
              <label htmlFor={`task-${task.id}`}>
                {task.name}
              </label>

              {/* 4c. (¡NUEVO!) Botón de borrar TAREA */}
              <button 
                className="task-delete-btn"
                onClick={() => deleteTask(path.id, task.id)}
                title="Eliminar tarea" // Tooltip de accesibilidad
              >
                &times; {/* Este es el caracter de una 'X' elegante */}
              </button>

            </div>
          ))
        )}
      </div>

      {/* 4d. Footer de la tarjeta con el botón de borrar RUTA */}
      <div className="path-card-footer">
        <button 
          className="path-delete-btn"
          onClick={handleDeletePath}
        >
          Eliminar Ruta
        </button>
      </div>

    </div>
  );
};
// ---
// 4. --- (FIN) SUB-COMPONENTE: PathCard ---
// ---


// 5. --- (INICIO) COMPONENTE PRINCIPAL: TaskManager ---
export default function TaskManager() {
  
  const { paths, addPath } = useContext(PathsContext);
  const [newPathName, setNewPathName] = useState('');

  const handleSubmit = (evento) => {
    evento.preventDefault();
    addPath(newPathName);
    setNewPathName('');
  };

  return (
    <div className="manager-container">
      
      {/* Formulario para crear RUTAS */}
      <form className="path-form" onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Ej: Aprender React Avanzado"
          value={newPathName}
          onChange={(e) => setNewPathName(e.target.value)}
          required
        />
        <button type="submit">Crear Ruta</button>
      </form>

      {/* Lista de RUTAS */}
      <section className="paths-list">
        {paths.length === 0 ? (
          <div className="empty-paths">
            <p>¡No hay Hojas de Ruta todavía!</p>
            <p>Usa el formulario de arriba para crear la primera.</p>
          </div>
        ) : (
          paths.map(path => (
            <PathCard key={path.id} path={path} />
          ))
        )}
      </section>

    </div>
  );
}
// ---
// 5. --- (FIN) COMPONENTE PRINCIPAL: TaskManager ---
// ---