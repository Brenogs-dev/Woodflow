import React, { useState, useEffect } from 'react';
import api from '../services/api';

const STATUS_LABELS = {
  orcamento: 'Orçamento',
  em_producao: 'Em Produção',
  concluido: 'Concluído',
  entregue: 'Entregue',
};

const EMPTY_FORM = { nome: '', descricao: '', cliente_id: '', prazo: '', valor: '', status: 'orcamento' };

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      const params = filtroStatus ? `?status=${filtroStatus}` : '';
      const [p, c] = await Promise.all([api.get(`/projetos${params}`), api.get('/clientes')]);
      setProjetos(p.data);
      setClientes(c.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, [filtroStatus]);

  const abrirNovo = () => { setEditando(null); setForm(EMPTY_FORM); setErro(''); setModal(true); };
  const abrirEditar = (p) => {
    setEditando(p.id);
    setForm({ nome: p.nome, descricao: p.descricao || '', cliente_id: p.cliente_id, prazo: p.prazo?.slice(0,10) || '', valor: p.valor || '', status: p.status });
    setErro('');
    setModal(true);
  };

  const salvar = async () => {
    if (!form.nome || !form.cliente_id) { setErro('Nome e cliente são obrigatórios.'); return; }
    try {
      if (editando) { await api.put(`/projetos/${editando}`, form); }
      else { await api.post('/projetos', form); }
      setModal(false);
      carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar.'); }
  };

  const remover = async (id) => {
    if (!globalThis.confirm('Remover este projeto?')) return;
    await api.delete(`/projetos/${id}`);
    carregar();
  };

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projetos</h1>
          <p className="page-subtitle">{projetos.length} projeto(s) encontrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>+ Novo Projeto</button>
      </div>

      <div className="filters">
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">Carregando...</div> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome do Projeto</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Prazo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projetos.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.descricao?.slice(0,50)}</span></td>
                  <td>{p.cliente_nome}</td>
                  <td><span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status]}</span></td>
                  <td style={{ color: p.prazo?.slice(0,10) < hoje && p.status !== 'entregue' ? 'var(--danger)' : 'inherit', fontWeight: p.prazo?.slice(0,10) < hoje ? 600 : 400 }}>
                    {p.prazo ? new Date(p.prazo + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td>{p.valor ? `R$ ${Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remover(p.id)}>Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
              {projetos.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">◧</div><p>Nenhum projeto encontrado</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)} role="dialog" aria-modal="true" aria-labelledby="modal-title-projeto">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title" id="modal-title-projeto">{editando ? 'Editar Projeto' : 'Novo Projeto'}</h2>
              <button className="modal-close" onClick={() => setModal(false)} aria-label="Fechar modal">×</button>
            </div>
            {erro && <div className="alert alert-error">{erro}</div>}
            <div className="form-group">
              <label htmlFor="projeto-nome">Nome do Projeto</label>
              <input id="projeto-nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Armário planejado sala" />
            </div>
            <div className="form-group">
              <label htmlFor="projeto-descricao">Descrição</label>
              <textarea id="projeto-descricao" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Detalhes do projeto..." />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="projeto-cliente">Cliente</label>
                <select id="projeto-cliente" value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})}>
                  <option value="">Selecione...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="projeto-status">Status</label>
                <select id="projeto-status" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {Object.entries(STATUS_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="projeto-prazo">Prazo</label>
                <input id="projeto-prazo" type="date" value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})} />
              </div>
              <div className="form-group">
                <label htmlFor="projeto-valor">Valor (R$)</label>
                <input id="projeto-valor" type="number" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="0,00" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
