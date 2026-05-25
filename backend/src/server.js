require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Desabilitar header X-Powered-By para não expor versão do Express
app.disable('x-powered-by');

// Configurar CORS com origens permitidas explicitamente
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido para esta origem'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
