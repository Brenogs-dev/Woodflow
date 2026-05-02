import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', icon: '◼', label: 'Dashboard' },
  { path: '/kanban', icon: '▦', label: 'Painel Kanban' },
  { path: '/projetos', icon: '◧', label: 'Projetos' },
  { path: '/clientes', icon: '◉', label: 'Clientes' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Woodflow</h1>
          <span>Gerenciador de Projetos</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">Conectado como</div>
          <div className="user-name">{usuario?.nome}</div>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
