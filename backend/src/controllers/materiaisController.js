const pool = require('../config/db');

const listarPorProjeto = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM materiais WHERE projeto_id = ?', [req.params.projeto_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const criar = async (req, res) => {
  const { nome, quantidade, unidade, custo } = req.body;
  const { projeto_id } = req.params;
  if (!nome || !quantidade) return res.status(400).json({ erro: 'Nome e quantidade são obrigatórios.' });
  try {
    const [result] = await pool.query(
      'INSERT INTO materiais (projeto_id, nome, quantidade, unidade, custo) VALUES (?, ?, ?, ?, ?)',
      [projeto_id, nome, quantidade, unidade, custo]
    );
    res.status(201).json({ id: result.insertId, projeto_id, nome, quantidade, unidade, custo });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizar = async (req, res) => {
  const { nome, quantidade, unidade, custo } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE materiais SET nome=?, quantidade=?, unidade=?, custo=? WHERE id=? AND projeto_id=?',
      [nome, quantidade, unidade, custo, req.params.id, req.params.projeto_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Material não encontrado.' });
    res.json({ mensagem: 'Material atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const remover = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM materiais WHERE id=? AND projeto_id=?',
      [req.params.id, req.params.projeto_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Material não encontrado.' });
    res.json({ mensagem: 'Material removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listarPorProjeto, criar, atualizar, remover };
