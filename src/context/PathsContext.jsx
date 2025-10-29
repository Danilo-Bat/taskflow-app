// 1. Importo las herramientas necesarias
import React, { createContext, useState, useEffect } from 'react';

// 2. Creo el "molde" del contexto
export const PathsContext = createContext();

// 3. Defino el nombre de mi "llave" en localStorage
const LOCAL_STORAGE_KEY = 'taskflowPaths';

// 4. Creo el Proveedor
export const PathsProvider = ({ children }) => {
  
  // 5. INICIO OPTIMIZADO: Leo el estado inicial desde localStorage
  const [paths, setPaths] = useState(() => {
    try {
      const storedPaths = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedPaths ? JSON.parse(storedPaths) : [];
    } catch (error) {
      console.error('Error al leer paths de localStorage', error);
      return [];
    }
  });

  // 6. EFECTO SECUNDARIO (useEffect): Persistencia Automática
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(paths));
    } catch (error) {
      console.error('Error al guardar paths en localStorage', error);
    }
  }, [paths]); 

  // --- Funciones para manipular el estado ---

  // 7. Función para AÑADIR una nueva Hoja de Ruta
  const addPath = (pathName) => {
    if (!pathName || pathName.trim() === '') return;
    const newPath = {
      id: Date.now(), 
      name: pathName.trim(),
      tasks: [], 
    };
    setPaths(prevPaths => [...prevPaths, newPath]);
  };

  // 8. Función para AÑADIR una Tarea a una Ruta Específica
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
        path.id === pathId ? { ...path, tasks: [...path.tasks, newTask] } : path
      )
    );
  };

  // 9. Función para MARCAR/DESMARCAR una Tarea
  const toggleTaskStatus = (pathId, taskId) => {
    if (!pathId || !taskId) return;
    setPaths(prevPaths => 
      prevPaths.map(path => 
        path.id === pathId 
          ? { 
              ...path, 
              tasks: path.tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ) 
            } 
          : path
      )
    );
  };

  // 10. Función para BORRAR una Tarea Específica
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

  // 10b. Función para ACTUALIZAR CUALQUIER DATO de una Tarea
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

  // 11. Función para BORRAR una Hoja de Ruta COMPLETA
  const deletePath = (pathId) => {
    if (!pathId) return;
    setPaths(prevPaths => prevPaths.filter(path => path.id !== pathId));
  };
  
  // 11b. Función para ACTUALIZAR el nombre de la RUTA
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
  
  // 11c. Función para REORDENAR las Tareas
  const reorderTasks = (pathId, reorderedTasks) => {
    if (!pathId || !reorderedTasks) return;
    
    setPaths(prevPaths => 
      prevPaths.map(path => 
        path.id === pathId
          // Reemplaza el array de tareas antiguo por el nuevo
          ? { ...path, tasks: reorderedTasks }
          : path
      )
    );
  };


  // 12. El OBJETO 'value'
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

  // 13. Retorno el proveedor
  return (
    <PathsContext.Provider value={value}>
      {children}
    </PathsContext.Provider>
  );
};