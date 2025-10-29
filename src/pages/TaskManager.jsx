import React, { useContext, useState, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { PathsContext } from '../context/PathsContext';
import { usePathCardLogic } from '../hooks/usePathCardLogic';
import './TaskManager.css';

const PathCard = ({ path }) => {
  
  const {
    taskName, setTaskName,
    taskPriority, setTaskPriority,
    editingTaskId,
    editingTaskName, setEditingTaskName,
    editingTaskPriority, setEditingTaskPriority,
    isEditingPathName,
    editingPathName, setEditingPathName,
    filter, setFilter,
    handleTaskSubmit,
    handleDeletePath,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleStartEditPathName,
    handleCancelEditPathName,
    handleSavePathName,
    handleDragStart,
    handleOnDragEnd,
    toggleTaskStatus,
    deleteTask,
    filteredTasks,
    getFilterButtonClass,
    completedTasks,
    totalTasks,
    progressPercentage,
    draggingIdRef,
  } = usePathCardLogic(path);
  
  return (
    <div className="path-card">
      
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
              aria-label={`Editar nombre de la ruta ${path.name}`}
            >
              <FaPencilAlt />
            </button>
            <button 
              className="path-delete-btn"
              onClick={handleDeletePath}
              title="Eliminar Ruta"
              aria-label={`Eliminar la ruta ${path.name}`}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      )}
      
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

      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <Droppable droppableId={String(path.id)}>
          {(provided) => (
            <div 
              className="task-list" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
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
                  filteredTasks.map((task, index) => {
                    const isBeingDragged = draggingIdRef.current === String(task.id);
                    
                    return (
                      <Draggable 
                        key={task.id} 
                        draggableId={String(task.id)} 
                        index={index}
                        isDragDisabled={editingTaskId !== null}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <motion.div 
                              layout={!isBeingDragged}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ 
                                opacity: 1, 
                                height: 'auto',
                                transition: {
                                  opacity: { duration: 0.2 },
                                  height: { duration: 0.3, ease: "easeInOut" }
                                }
                              }}
                              exit={
                                isBeingDragged 
                                  ? false
                                  : { 
                                      opacity: 0, 
                                      height: 0,
                                      transition: {
                                        opacity: { duration: 0.2 },
                                        height: { duration: 0.3, ease: "easeInOut" }
                                      }
                                    }
                              }
                              transition={{ 
                                layout: { duration: 0.2, ease: "easeInOut" }
                              }}
                              style={{
                                overflow: 'hidden',
                                transformOrigin: 'top',
                              }}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={`task-item ${task.completed ? 'completed' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                              >
                                
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
                                        aria-label={`Editar la tarea ${task.name}`}
                                      >
                                        <FaPencilAlt />
                                      </button>
                                      <button 
                                        className="task-control-btn delete-btn"
                                        onClick={() => deleteTask(path.id, task.id)}
                                        title="Eliminar tarea"
                                        aria-label={`Eliminar la tarea ${task.name}`}
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        )} 
                      </Draggable>
                    );
                  })
                )}
              </AnimatePresence>
              
              {provided.placeholder}
            </div>
          )}
        </Droppable> 
      </DragDropContext>
    </div>
  );
};

const MemoizedPathCard = memo(PathCard);

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

      <section className="paths-list">
        {paths.length === 0 ? (
          <div className="empty-paths">
            <p>¡No hay Hojas de Ruta todavía!</p>
            <p>Usa el formulario de arriba para crear la primera.</p>
          </div>
        ) : (
          paths.map(path => (
            <MemoizedPathCard key={path.id} path={path} />
          ))
        )}
      </section>
    </div>
  );
}