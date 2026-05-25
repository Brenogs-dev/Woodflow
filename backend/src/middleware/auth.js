const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'woodflow_secret', (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido.' });
    req.usuario = usuario;
    next();
  });
};

module.exports = { autenticar };
