import { FiUsers, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

function KpiCards({ kpis }) {
  const cards = [
    {
      title: 'Total de Atendimentos',
      value: kpis.totalAtendimentos,
      icon: <FiUsers size={28} />,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      title: 'Concluídos',
      value: kpis.totalConcluidos,
      icon: <FiCheckCircle size={28} />,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      title: 'Cancelados',
      value: kpis.totalCancelados,
      icon: <FiXCircle size={28} />,
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
    {
      title: 'Receita Total',
      value: `R$ ${kpis.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: <FiDollarSign size={28} />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff'
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, index) => (
        <div key={index} className="kpi-card" style={{ borderLeftColor: card.color }}>
          <div className="kpi-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
            {card.icon}
          </div>
          <div className="kpi-info">
            <span className="kpi-title">{card.title}</span>
            <span className="kpi-value">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KpiCards;
