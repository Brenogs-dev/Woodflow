import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EMPTY_FORM = { nome: '', telefone: '', email: '', endereco: '' };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    try {
      const { data } = await api.get('/clientes');
      setClientes(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => { setEditando(null); setForm(EMPTY_FORM); setErro(''); setModal(true); };
  const abrirEditar = (c) => { setEditando(c.id); setForm({ nome: c.nome, telefone: c.telefone || '', email: c.email || '', endereco: c.endereco || '' }); setErro(''); setModal(true); };

  const salvar = async () => {
    if (!form.nome) { setErro('Nome é obrigatório.'); return; }
    try {
      if (editando) { await api.put(`/clientes/${editando}`, form); }
      else { await api.post('/clientes', form); }
      setModal(false);
      carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar.'); }
  };

  const remover = async (id) => {
    if (!window.confirm('Remover este cliente?')) return;
    try { await api.delete(`/clientes/${id}`); carregar(); }
    catch { alert('Não é possível remover cliente com projetos associados.'); }
  };

  const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.email?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>+ Novo Cliente</button>
      </div>

      <div className="filters">
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou e-mail..." style={{ minWidth: 260 }} />
      </div>

      {loading ? <div className="loading">Carregando...</div> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.nome}</strong></td>
                  <td>{c.telefone || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.endereco || '—'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(c)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remover(c.id)}>Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">◉</div><p>Nenhum cliente encontrado</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {erro && <div className="alert alert-error">{erro}</div>}
            <div className="form-group">
              <label>Nome *</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Nome completo" />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Telefone</label>
                <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(83) 99999-9999" />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="cliente@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Endereço</label>
              <textarea value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} placeholder="Rua, número, bairro..." rows={2} />
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
