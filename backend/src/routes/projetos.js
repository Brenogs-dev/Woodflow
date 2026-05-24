const express = require('express');
const router = express.Router();
const { listar, buscarPorId, criar, atualizar, remover } = require('../controllers/projetosController');
const materiaisCtrl = require('../controllers/materiaisController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', remover);

// Materiais aninhados
router.get('/:projeto_id/materiais', materiaisCtrl.listarPorProjeto);
router.post('/:projeto_id/materiais', materiaisCtrl.criar);
router.put('/:projeto_id/materiais/:id', materiaisCtrl.atualizar);
router.delete('/:projeto_id/materiais/:id', materiaisCtrl.remover);

module.exports = router;
