import { useState } from 'react';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import { FiBarChart2, FiList } from 'react-icons/fi';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Painel Jur\u00eddico</h1>
          <p className="header-subtitle">Sistema de Gest\u00e3o de Atendimentos</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FiBarChart2 /> Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'agendamentos' ? 'active' : ''}`}
          onClick={() => setActiveTab('agendamentos')}
        >
          <FiList /> Agendamentos
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'agendamentos' && <DataTable />}
      </main>

      <footer className="app-footer">
        <p>Painel Jur\u00eddico &copy; {new Date().getFullYear()} \u2014 Prova T\u00e9cnica Full Stack</p>
      </footer>
    </div>
  );
}

export default App;
