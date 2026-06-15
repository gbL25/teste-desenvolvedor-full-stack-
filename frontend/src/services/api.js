import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Busca atendimentos com filtros e paginação
 */
export const getAtendimentos = async (params = {}) => {
  const response = await api.get('/atendimentos', { params });
  return response.data;
};

/**
 * Busca métricas do dashboard
 */
export const getMetricas = async () => {
  const response = await api.get('/atendimentos/metricas');
  return response.data;
};

/**
 * Busca dados para exportação (sem paginação)
 */
export const getExportacao = async (params = {}) => {
  const response = await api.get('/atendimentos/exportar', { params });
  return response.data;
};

export default api;
