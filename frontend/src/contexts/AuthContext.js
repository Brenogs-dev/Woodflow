import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('wf_token');
    const u = localStorage.getItem('wf_usuario');
    if (t && u) { setToken(t); setUsuario(JSON.parse(u)); }
  }, []);

  const login = (tokenData, usuarioData) => {
    localStorage.setItem('wf_token', tokenData);
    localStorage.setItem('wf_usuario', JSON.stringify(usuarioData));
    setToken(tokenData);
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.removeItem('wf_token');
    localStorage.removeItem('wf_usuario');
    setToken(null);
    setUsuario(null);
  };

  const value = useMemo(
    () => ({ usuario, token, login, logout, autenticado: !!token }),
    [usuario, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
