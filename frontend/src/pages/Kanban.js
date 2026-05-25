import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const COLUNAS = [
  { key: 'orcamento', label: 'Orçamento' },
  { key: 'em_producao', label: 'Em Produção' },
  { key: 'concluido', label: 'Concluído' },
  { key: 'entregue', label: 'Entregue' },
];

const KanbanCard = ({ projeto, hoje, onAtualizarStatus }) => {
  const atrasado = projeto.prazo && projeto.prazo.slice(0,10) < hoje && projeto.status !== 'entregue';
  return (
    <div className="kanban-card">
      <div className="kanban-card-title">{projeto.nome}</div>
      <div className="kanban-card-client">👤 {projeto.cliente_nome}</div>
      {projeto.prazo && (
        <div className={`kanban-card-prazo ${atrasado ? 'atrasado' : ''}`}>
          {atrasado ? '⚠️ ' : '📅 '}
          {new Date(projeto.prazo + 'T12:00:00').toLocaleDateString('pt-BR')}
        </div>
      )}
      {projeto.valor && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6 }}>
          💰 R$ {Number(projeto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )}
      <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {COLUNAS.filter(c => c.key !== projeto.status).map(c => (
          <button
            key={c.key}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.7rem', padding: '3px 7px' }}
            onClick={() => onAtualizarStatus(projeto.id, c.key)}
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
};

KanbanCard.propTypes = {
  projeto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    cliente_nome: PropTypes.string,
    prazo: PropTypes.string,
    valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string.isRequired,
  }).isRequired,
  hoje: PropTypes.string.isRequired,
  onAtualizarStatus: PropTypes.func.isRequired,
};

export default function Kanban() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projetos')
      .then(r => setProjetos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const atualizarStatus = useCallback(async (id, novoStatus) => {
    const projeto = projetos.find(p => p.id === id);
    if (!projeto) return;
    try {
      await api.put(`/projetos/${id}`, { ...projeto, status: novoStatus, cliente_id: projeto.cliente_id });
      setProjetos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    } catch {
      alert('Erro ao atualizar status.');
    }
  }, [projetos]);

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Painel Kanban</h1>
          <p className="page-subtitle">Acompanhe o fluxo de produção</p>
        </div>
      </div>

      {loading ? <div className="loading">Carregando...</div> : (
        <div className="kanban">
          {COLUNAS.map(col => {
            const cards = projetos.filter(p => p.status === col.key);
            return (
              <div key={col.key} className="kanban-col">
                <div className={`kanban-col-header ${col.key}`}>
                  {col.label} <span style={{ opacity: 0.7 }}>({cards.length})</span>
                </div>
                <div className="kanban-cards">
                  {cards.map(p => (
                    <KanbanCard key={p.id} projeto={p} hoje={hoje} onAtualizarStatus={atualizarStatus} />
                  ))}
                  {cards.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.82rem' }}>
                      Nenhum projeto
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
