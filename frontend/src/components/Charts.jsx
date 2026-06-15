import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];
const AREA_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function Charts({ porStatus, porArea, evolucaoMensal }) {
  const formatMonth = (mes) => {
    const [year, month] = mes.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(month) - 1]}/${year.slice(2)}`;
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Distribuição por Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={porStatus}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ status, quantidade, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="quantidade"
              nameKey="status"
            >
              {porStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Atendimentos por Área Jurídica</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porArea} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" name="Quantidade">
              {porArea.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={AREA_COLORS[index % AREA_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card chart-full">
        <h3>Evolução Mensal de Atendimentos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolucaoMensal.map(item => ({ ...item, mesFormatado: formatMonth(item.mes) }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mesFormatado" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip labelFormatter={(value) => `Mês: ${value}`} />
            <Legend />
            <Line type="monotone" dataKey="quantidade" name="Atendimentos" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
