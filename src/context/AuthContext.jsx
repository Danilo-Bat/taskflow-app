import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const USERS_STORAGE_KEY = 'taskflowUsers';

export const AuthProvider = ({ children }) => {
  
  // Verificamos si hay una sesión activa
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedAuth = localStorage.getItem('taskflowAuth');
    return storedAuth === 'true';
  });

  // Datos del usuario actual
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('taskflowUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  // Obtener todos los usuarios registrados
  const getUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  };

  // Guardar usuarios en localStorage
  const saveUsers = (users) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error al guardar usuarios', error);
    }
  };

  // Función para registrar un nuevo usuario
  const register = (name, email, password) => {
    const users = getUsers();
    
    // Verificamos si el email ya existe
    const emailExists = users.find(u => u.email === email);
    if (emailExists) {
      return { success: false, error: 'Este email ya está registrado' };
    }

    // Creamos el nuevo usuario
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };

    // Lo agregamos a la lista
    users.push(newUser);
    saveUsers(users);

    // Iniciamos sesión automáticamente
    const userData = {
      email: newUser.email,
      name: newUser.name
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('taskflowAuth', 'true');
    localStorage.setItem('taskflowUser', JSON.stringify(userData));

    return { success: true };
  };

  // Función para iniciar sesión
  const login = (email, password) => {
    const users = getUsers();
    
    // Buscamos el usuario
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    // Iniciamos sesión
    const userData = {
      email: foundUser.email,
      name: foundUser.name
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('taskflowAuth', 'true');
    localStorage.setItem('taskflowUser', JSON.stringify(userData));

    return { success: true };
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('taskflowAuth');
    localStorage.removeItem('taskflowUser');
  };

  const value = {
    isLoggedIn,
    user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};