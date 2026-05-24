import React, { useState, useEffect } from 'react';
import api from '../services/api';

const STATUS_LABELS = {
  orcamento: 'Orçamento',
  em_producao: 'Em Produção',
  concluido: 'Concluído',
  entregue: 'Entregue',
};

export default function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/projetos'), api.get('/clientes')])
      .then(([p, c]) => { setProjetos(p.data); setClientes(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const contarStatus = (s) => projetos.filter(p => p.status === s).length;
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasados = projetos.filter(p => p.prazo && p.prazo < hoje && p.status !== 'entregue').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral dos projetos</p>
        </div>
      </div>

      {loading ? <div className="loading">Carregando...</div> : (
        <>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-label">Total de Projetos</div>
              <div className="stat-value">{projetos.length}</div>
            </div>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className={`stat-card ${key}`}>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{contarStatus(key)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="card">
              <div className="stat-label" style={{ marginBottom: 8 }}>Total de Clientes</div>
              <div className="stat-value">{clientes.length}</div>
            </div>
            <div className="card" style={{ borderLeft: atrasados > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
              <div className="stat-label" style={{ marginBottom: 8 }}>Projetos Atrasados</div>
              <div className="stat-value" style={{ color: atrasados > 0 ? 'var(--danger)' : 'var(--success)' }}>
                {atrasados}
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Prazo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {projetos.slice(0, 10).map(p => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.cliente_nome}</td>
                    <td><span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status]}</span></td>
                    <td style={{ color: p.prazo < hoje && p.status !== 'entregue' ? 'var(--danger)' : 'inherit' }}>
                      {p.prazo ? new Date(p.prazo + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>{p.valor ? `R$ ${Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</td>
                  </tr>
                ))}
                {projetos.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Nenhum projeto ainda</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
