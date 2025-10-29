import React, { lazy, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PrivateLayout } from './PrivateLayout';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TaskManager = lazy(() => import('../pages/TaskManager'));

export const AppRouter = () => {
  
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      
      {!isLoggedIn && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {isLoggedIn && (
        <Route path="/" element={<PrivateLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manager" element={<TaskManager />} />
          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Route>
      )}
      
    </Routes>
  );
};