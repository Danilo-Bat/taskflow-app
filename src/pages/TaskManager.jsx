// 1. Importo las herramientas
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; 
// (NUEVO) Importamos Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// 2. Importo AMBOS contextos
import { AuthContext } from '../context/AuthContext';
import { PathsContext } from '../context/PathsContext';

// 3. Importo mis estilos
import './TaskManager.css';


// 4. --- (INICIO) SUB-COMPONENTE: PathCard ---
const PathCard = ({ path }) => {
  // ... (toda la lógica de estados y funciones 'handle' NO cambia)
  const { 
    addTaskToPath, 
    toggleTaskStatus, 
    deleteTask, 
    deletePath,
    updateTask,
    updatePathName,
    reorderTasks
  } = useContext(PathsContext);
  
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');
  const [editingTaskPriority, setEditingTaskPriority] = useState('low');
  const [isEditingPathName, setIsEditingPathName] = useState(false);
  const [editingPathName, setEditingPathName] = useState('');
  const [filter, setFilter] = useState('all');

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    addTaskToPath(path.id, taskName, taskPriority);
    setTaskName(''); 
    setTaskPriority('low');
  };

  const handleDeletePath = () => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la ruta "${path.name}"? Esta acción no se puede deshacer.`
    );
    if (isConfirmed) {
      deletePath(path.id);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
    setEditingTaskPriority(task.priority || 'low');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
    setEditingTaskPriority('low');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedData = {
      name: editingTaskName,
      priority: editingTaskPriority
    };
    updateTask(path.id, editingTaskId, updatedData);
    handleCancelEdit();
  };
  
  const handleStartEditPathName = () => {
    setIsEditingPathName(true);
    setEditingPathName(path.name);
  };
  
  const handleCancelEditPathName = () => {
    setIsEditingPathName(false);
    setEditingPathName('');
  };

  const handleSavePathName = (e) => {
    e.preventDefault();
    updatePathName(path.id, editingPathName);
    handleCancelEditPathName();
  };
  
  const handleOnDragEnd = (result) => {
    if (filter !== 'all') {
      alert('Por favor, activa el filtro "Todas" para reordenar las tareas.');
      return;
    }
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const newTasks = Array.from(path.tasks); 
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    reorderTasks(path.id, newTasks);
  };
  
  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return path.tasks.filter(task => task.completed);
      case 'pending':
        return path.tasks.filter(task => !task.completed);
      case 'all':
      default:
        return path.tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getFilterButtonClass = (buttonFilter) => {
    return `filter-btn ${filter === buttonFilter ? 'active' : ''}`;
  };
  
  const totalTasks = path.tasks.length;
  const completedTasks = path.tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  // ... (Fin de la lógica que no cambia)


  return (
    <div className="path-card">
      
      {/* --- Título de la Ruta (con Edición) --- (Sin cambios) */}
      {isEditingPathName ? (
        <form className="path-edit-form" onSubmit={handleSavePathName}>
          <input 
            type="text"
            value={editingPathName}
            onChange={(e) => setEditingPathName(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="path-edit-save-btn">Guardar</button>
          <button type="button" onClick={handleCancelEditPathName} className="path-edit-cancel-btn">
            Cancelar
          </button>
        </form>
      ) : (
        <div className="path-header">
          <h2>{path.name}</h2>
          <div className="path-header-controls">
            <button 
              className="path-edit-btn" 
              onClick={handleStartEditPathName}
              title="Editar nombre de la ruta"
            >
              <FaPencilAlt />
            </button>
            <button 
              className="path-delete-btn"
              onClick={handleDeletePath}
              title="Eliminar Ruta"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      )}
      
      {/* --- Barra de Progreso --- (Sin cambios) */}
      <div className="path-progress-section">
        <div className="path-progress-text">
          Progreso: {completedTasks} / {totalTasks}
        </div>
        <div className="path-progress-bar">
          <div 
            className="path-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* --- Formulario para añadir TAREAS --- (Sin cambios) */}
      <form className="task-form" onSubmit={handleTaskSubmit}>
        <input 
          type="text"
          placeholder="Nueva tarea (Ej: Aprender useState)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <select 
          className="task-priority-select"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="low">Prioridad: Baja</option>
          <option value="medium">Prioridad: Media</option>
          <option value="high">Prioridad: Alta</option>
        </select>
        <button type="submit">Añadir</button>
      </form>
      
      {/* --- Contenedor de Filtros --- (Sin cambios) */}
      <div className="task-filter-controls">
        <button 
          className={getFilterButtonClass('all')}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={getFilterButtonClass('pending')}
          onClick={() => setFilter('pending')}
        >
          Pendientes
        </button>
        <button 
          className={getFilterButtonClass('completed')}
          onClick={() => setFilter('completed')}
        >
          Completadas
        </button>
      </div>

      {/* --- (MODIFICADO) Lista de Tareas con Drag & Drop --- */}
      
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={String(path.id)}>
          {(provided) => (
            
            <div // (NOTA) No hacemos motion.div aquí por el D&D, lo hacemos en el item
              className="task-list" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
            >
              
              {/* (NUEVO) Envolvemos el map con AnimatePresence */}
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  
                  // (NUEVO) También animamos el mensaje de "vacío"
                  <motion.p
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="task-list-empty-msg"
                  >
                    {path.tasks.length === 0 
                      ? "No hay tareas en esta ruta." 
                      : `No hay tareas que coincidan con el filtro "${filter}".`
                    }
                  </motion.p>

                ) : (
                  
                  filteredTasks.map((task, index) => (
                    
                    <Draggable 
                      key={task.id} // El key se mantiene aquí para el Draggable
                      draggableId={String(task.id)} 
                      index={index}
                      isDragDisabled={editingTaskId !== null}
                    >
                      {(provided) => (
                        
                        // (MODIFICADO) Este es el <div> que se convierte en motion.div
                        <motion.div 
                          // Pasamos el key también aquí para Framer Motion
                          key={task.id} 
                          
                          // --- (NUEVO) Props de Animación ---
                          layout="position" // Anima el reordenamiento
                          initial={{ opacity: 0, height: 0 }} // Al aparecer
                          animate={{ opacity: 1, height: 'auto' }} // Al aparecer
                          exit={{ opacity: 0, height: 0 }} // Al desaparecer (filtrar)
                          transition={{ 
                            opacity: { duration: 0.2 },
                            height: { duration: 0.3, ease: "easeInOut" },
                            layout: { duration: 0.2, ease: "easeInOut" }
                          }}
                          // --- Fin Props Animación ---
                          
                          className={`task-item ${task.completed ? 'completed' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps} 
                        >
                          
                          {/* --- Contenido de la Tarea --- (Sin cambios) */}
                          {editingTaskId === task.id ? (
                            
                            <form className="edit-task-form" onSubmit={handleSaveEdit}>
                              <input 
                                type="text"
                                value={editingTaskName}
                                onChange={(e) => setEditingTaskName(e.target.value)}
                                autoFocus
                                required
                              />
                              <select
                                className="task-priority-select-edit"
                                value={editingTaskPriority}
                                onChange={(e) => setEditingTaskPriority(e.target.value)}
                              >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                              </select>
                              <button type="submit" className="task-edit-save-btn">Guardar</button>
                              <button type="button" onClick={handleCancelEdit} className="task-edit-cancel-btn">
                                Cancelar
                              </button>
                            </form>

                          ) : (
                            <>
                              <input 
                                type="checkbox" 
                                id={`task-${task.id}`}
                                checked={task.completed}
                                onChange={() => toggleTaskStatus(path.id, task.id)}
                              />
                              <label htmlFor={`task-${task.id}`}>
                                {task.name}
                                {task.priority && (
                                  <span className={`priority-tag ${task.priority}`}>
                                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                  </span>
                                )}
                              </label>
                              
                              <div className="task-item-controls">
                                <button 
                                  className="task-control-btn edit-btn"
                                  onClick={() => handleStartEdit(task)}
                                  title="Editar tarea"
                                >
                                  <FaPencilAlt />
                                </button>
                                <button 
                                  className="task-control-btn delete-btn"
                                  onClick={() => deleteTask(path.id, task.id)}
                                  title="Eliminar tarea"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </>
                          )}
                        </motion.div> // Fin motion.div
                      )} 
                    </Draggable>
                  ))
                )}
              </AnimatePresence> {/* Fin AnimatePresence */}
              
              {provided.placeholder}
              
            </div>
          )}
        </Droppable> 
      </DragDropContext>
      {/* --- FIN Lista de Tareas --- */}
      
    </div>
  );
};
// ---
// 5. --- (FIN) SUB-COMPONENTE: PathCard ---
// ---


// 6. --- (INICIO) COMPONENTE PRINCIPAL: TaskManager --- (Sin cambios)
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
// 6. --- (FIN) COMPONENTE PRINCIPAL: TaskManager ---
// ---