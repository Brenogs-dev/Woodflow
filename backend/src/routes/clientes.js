const express = require('express');
const router = express.Router();
const { listar, buscarPorId, criar, atualizar, remover } = require('../controllers/clientesController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', remover);

module.exports = router;
