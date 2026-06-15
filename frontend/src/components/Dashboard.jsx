import { useState, useEffect } from 'react';
import { getMetricas } from '../services/api';
import KpiCards from './KpiCards';
import Charts from './Charts';

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        const result = await getMetricas();
        setMetricas(result.data);
      } catch (err) {
        setError('Erro ao carregar métricas. Verifique se o servidor está rodando.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando métricas...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!metricas) return null;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <KpiCards kpis={metricas.kpis} />
      <Charts
        porStatus={metricas.porStatus}
        porArea={metricas.porArea}
        evolucaoMensal={metricas.evolucaoMensal}
      />
    </div>
  );
}

export default Dashboard;
