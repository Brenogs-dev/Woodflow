require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/projetos', require('./routes/projetos'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', servico: 'woodflow-api' }));

app.listen(PORT, () => {
  console.log(`Woodflow API rodando na porta ${PORT}`);
});
