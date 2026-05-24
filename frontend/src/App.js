import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projetos from './pages/Projetos';
import Clientes from './pages/Clientes';
import Kanban from './pages/Kanban';
import Layout from './components/Layout';

const Privada = ({ children }) => {
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Privada><Layout /></Privada>}>
            <Route index element={<Dashboard />} />
            <Route path="projetos" element={<Projetos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="kanban" element={<Kanban />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
