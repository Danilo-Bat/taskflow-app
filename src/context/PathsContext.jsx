import React, { createContext, useState, useEffect } from 'react';

export const PathsContext = createContext();

const LOCAL_STORAGE_KEY = 'taskflowPaths';

export const PathsProvider = ({ children }) => {
  
  // Cargamos las rutas guardadas o iniciamos con un array vacío
  const [paths, setPaths] = useState(() => {
    try {
      const storedPaths = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedPaths ? JSON.parse(storedPaths) : [];
    } catch (error) {
      console.error('Error al leer paths de localStorage', error);
      return [];
    }
  });

  // Guardamos automáticamente cada vez que las rutas cambian
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(paths));
    } catch (error) {
      console.error('Error al guardar paths en localStorage', error);
    }
  }, [paths]);

  // Función para añadir una nueva ruta
  const addPath = (pathName) => {
    if (!pathName || pathName.trim() === '') return;
    
    const newPath = {
      id: Date.now(),
      name: pathName.trim(),
      tasks: [],
    };
    
    setPaths(prevPaths => [...prevPaths, newPath]);
  };

  // Función para añadir una tarea a una ruta específica
  const addTaskToPath = (pathId, taskName, priority = 'low') => {
    if (!pathId || !taskName || taskName.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      completed: false,
      priority: priority
    };
    
    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId 
          ? { ...path, tasks: [...path.tasks, newTask] } 
          : path
      )
    );
  };

  // Función para marcar/desmarcar una tarea como completada
  const toggleTaskStatus = (pathId, taskId) => {
    if (!pathId || !taskId) return;
    
    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId
          ? {
              ...path,
              tasks: path.tasks.map(task =>
                task.id === taskId 
                  ? { ...task, completed: !task.completed } 
                  : task
              )
            }
          : path
      )
    );
  };

  // Función para eliminar una tarea
  const deleteTask = (pathId, taskId) => {
    if (!pathId || !taskId) return;
    
    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId
          ? {
              ...path,
              tasks: path.tasks.filter(task => task.id !== taskId)
            }
          : path
      )
    );
  };

  // Función para actualizar datos de una tarea (nombre, prioridad, etc)
  const updateTask = (pathId, taskId, updatedData) => {
    if (!pathId || !taskId || !updatedData) return;
    if (updatedData.name !== undefined && updatedData.name.trim() === '') return;

    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId
          ? {
              ...path,
              tasks: path.tasks.map(task =>
                task.id === taskId 
                  ? { ...task, ...updatedData } 
                  : task
              )
            }
          : path
      )
    );
  };

  // Función para eliminar una ruta completa
  const deletePath = (pathId) => {
    if (!pathId) return;
    setPaths(prevPaths => prevPaths.filter(path => path.id !== pathId));
  };

  // Función para actualizar el nombre de una ruta
  const updatePathName = (pathId, newName) => {
    if (!pathId || !newName || newName.trim() === '') return;
    
    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId 
          ? { ...path, name: newName.trim() } 
          : path
      )
    );
  };

  // Función para reordenar las tareas después del drag and drop
  const reorderTasks = (pathId, reorderedTasks) => {
    if (!pathId || !reorderedTasks) return;
    
    setPaths(prevPaths =>
      prevPaths.map(path =>
        path.id === pathId 
          ? { ...path, tasks: reorderedTasks } 
          : path
      )
    );
  };

  const value = {
    paths,
    addPath,
    addTaskToPath,
    toggleTaskStatus,
    deleteTask,
    deletePath,
    updateTask,
    updatePathName,
    reorderTasks,
  };

  return (
    <PathsContext.Provider value={value}>
      {children}
    </PathsContext.Provider>
  );
};