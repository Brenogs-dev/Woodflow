const pool = require('../config/db');

const listar = async (req, res) => {
  const { status, cliente_id } = req.query;
  let query = `
    SELECT p.*, c.nome AS cliente_nome
    FROM projetos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.deletado_em IS NULL
  `;
  const params = [];

  if (status) { query += ' AND p.status = ?'; params.push(status); }
  if (cliente_id) { query += ' AND p.cliente_id = ?'; params.push(cliente_id); }
  query += ' ORDER BY p.prazo ASC';

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS cliente_nome
      FROM projetos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ? AND p.deletado_em IS NULL
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Projeto não encontrado.' });

    const [materiais] = await pool.query('SELECT * FROM materiais WHERE projeto_id = ?', [req.params.id]);
    res.json({ ...rows[0], materiais });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const criar = async (req, res) => {
  const { nome, descricao, cliente_id, prazo, valor, status } = req.body;
  if (!nome || !cliente_id) return res.status(400).json({ erro: 'Nome e cliente são obrigatórios.' });
  try {
    const [result] = await pool.query(
      'INSERT INTO projetos (nome, descricao, cliente_id, prazo, valor, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, cliente_id, prazo, valor, status || 'orcamento']
    );
    res.status(201).json({ id: result.insertId, nome, descricao, cliente_id, prazo, valor, status: status || 'orcamento' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizar = async (req, res) => {
  const { nome, descricao, cliente_id, prazo, valor, status } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE projetos SET nome=?, descricao=?, cliente_id=?, prazo=?, valor=?, status=?, atualizado_em=NOW() WHERE id=? AND deletado_em IS NULL',
      [nome, descricao, cliente_id, prazo, valor, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    res.json({ mensagem: 'Projeto atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const remover = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE projetos SET deletado_em=NOW() WHERE id=? AND deletado_em IS NULL',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    res.json({ mensagem: 'Projeto removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
