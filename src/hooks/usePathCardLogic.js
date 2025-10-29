import { useState, useContext, useMemo, useRef } from 'react';
import { PathsContext } from '../context/PathsContext';

export const usePathCardLogic = (path) => {
  
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

  // Ref para controlar el drag and drop
  const draggingIdRef = useRef(null);
  const [, forceRender] = useState({});

  // Manejar el envío del formulario de nueva tarea
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    addTaskToPath(path.id, taskName, taskPriority);
    setTaskName('');
    setTaskPriority('low');
  };

  // Manejar la eliminación de una ruta
  const handleDeletePath = () => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la ruta "${path.name}"? Esta acción no se puede deshacer.`
    );
    if (isConfirmed) {
      deletePath(path.id);
    }
  };

  // Iniciar edición de una tarea
  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
    setEditingTaskPriority(task.priority || 'low');
  };

  // Cancelar edición de tarea
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
    setEditingTaskPriority('low');
  };

  // Guardar edición de tarea
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedData = {
      name: editingTaskName,
      priority: editingTaskPriority
    };
    updateTask(path.id, editingTaskId, updatedData);
    handleCancelEdit();
  };
  
  // Iniciar edición del nombre de la ruta
  const handleStartEditPathName = () => {
    setIsEditingPathName(true);
    setEditingPathName(path.name);
  };
  
  // Cancelar edición del nombre de la ruta
  const handleCancelEditPathName = () => {
    setIsEditingPathName(false);
    setEditingPathName('');
  };

  // Guardar el nuevo nombre de la ruta
  const handleSavePathName = (e) => {
    e.preventDefault();
    updatePathName(path.id, editingPathName);
    handleCancelEditPathName();
  };
  
  // Manejar el inicio del drag
  const handleDragStart = (result) => {
    draggingIdRef.current = result.draggableId;
    forceRender({});
  };

  // Manejar el fin del drag
  const handleOnDragEnd = (result) => {
    draggingIdRef.current = null;

    if (filter !== 'all') {
      alert('Por favor, activa el filtro "Todas" para reordenar las tareas.');
      forceRender({});
      return;
    }
    
    if (!result.destination) {
      forceRender({});
      return;
    }
    
    if (result.destination.index === result.source.index) {
      forceRender({});
      return;
    }

    const newTasks = Array.from(path.tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    reorderTasks(path.id, newTasks);
  };
  
  // Filtrar tareas según el filtro activo
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return path.tasks.filter(task => task.completed);
      case 'pending':
        return path.tasks.filter(task => !task.completed);
      case 'all':
      default:
        return path.tasks;
    }
  }, [path.tasks, filter]);

  // Obtener la clase CSS para los botones de filtro
  const getFilterButtonClass = (buttonFilter) => {
    return `filter-btn ${filter === buttonFilter ? 'active' : ''}`;
  };
  
  // Calcular progreso de la ruta
  const { completedTasks, totalTasks, progressPercentage } = useMemo(() => {
    const totalTasks = path.tasks.length;
    const completedTasks = path.tasks.filter(task => task.completed).length;
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    return { completedTasks, totalTasks, progressPercentage };
  }, [path.tasks]);

  return {
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
  };
};