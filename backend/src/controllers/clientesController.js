const pool = require('../config/db');

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nome');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const criar = async (req, res) => {
  const { nome, telefone, email, endereco } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });
  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)',
      [nome, telefone, email, endereco]
    );
    res.status(201).json({ id: result.insertId, nome, telefone, email, endereco });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizar = async (req, res) => {
  const { nome, telefone, email, endereco } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE clientes SET nome=?, telefone=?, email=?, endereco=? WHERE id=?',
      [nome, telefone, email, endereco, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json({ mensagem: 'Cliente atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const remover = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json({ mensagem: 'Cliente removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
