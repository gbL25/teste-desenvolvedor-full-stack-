import { useState, useEffect, useCallback } from 'react';
import { getAtendimentos } from '../services/api';
import ExportButtons from './ExportButtons';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  // Filtros
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [areaJuridica, setAreaJuridica] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (busca) params.busca = busca;
      if (status) params.status = status;
      if (areaJuridica) params.area_juridica = areaJuridica;

      const result = await getAtendimentos(params);
      setData(result.data);
      setPagination(prev => ({ ...prev, ...result.pagination }));
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, busca, status, areaJuridica]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchData]);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAreaChange = (e) => {
    setAreaJuridica(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Concluído': 'badge-success',
      'Cancelado': 'badge-danger',
      'Agendado': 'badge-warning',
      'Em andamento': 'badge-info'
    };
    return <span className={`badge ${classes[status] || ''}`}>{status}</span>;
  };

  const activeFilters = { busca, status, area_juridica: areaJuridica };

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>Agendamentos</h2>
        <ExportButtons filters={activeFilters} />
      </div>

      <div className="table-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente, advogado ou área jurídica..."
            value={busca}
            onChange={handleBuscaChange}
          />
        </div>
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> Filtros
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status:</label>
            <select value={status} onChange={handleStatusChange}>
              <option value="">Todos</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Agendado">Agendado</option>
              <option value="Em andamento">Em andamento</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Área Jurídica:</label>
            <select value={areaJuridica} onChange={handleAreaChange}>
              <option value="">Todas</option>
              <option value="Trabalhista">Trabalhista</option>
              <option value="Civil">Civil</option>
              <option value="Previdenciário">Previdenciário</option>
              <option value="Família">Família</option>
              <option value="Criminal">Criminal</option>
              <option value="Tributário">Tributário</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Advogado</th>
                  <th>Área Jurídica</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">Nenhum registro encontrado</td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className="td-cliente">{item.cliente}</td>
                      <td>{new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td>{item.hora_inicio} - {item.hora_fim}</td>
                      <td>{item.advogado}</td>
                      <td>{item.area_juridica}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span className="pagination-info">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} registros
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <FiChevronLeft /> Anterior
              </button>
              <span className="page-number">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Próxima <FiChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DataTable;
