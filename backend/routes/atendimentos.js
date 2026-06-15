const express = require('express');
const router = express.Router();
const {
  getAtendimentos,
  getAtendimentoById,
  getMetricas,
  getExportacao
} = require('../controllers/atendimentosController');

// GET /api/atendimentos/metricas - Dashboard KPIs e gráficos
router.get('/metricas', getMetricas);

// GET /api/atendimentos/exportar - Dados para exportação (sem paginação)
router.get('/exportar', getExportacao);

// GET /api/atendimentos/:id - Atendimento específico
router.get('/:id', getAtendimentoById);

// GET /api/atendimentos - Lista com filtros e paginação
router.get('/', getAtendimentos);

module.exports = router;
