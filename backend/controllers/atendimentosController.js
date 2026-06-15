const atendimentos = require('../data/atendimentos.json');

/**
 * Retorna lista de atendimentos com filtros e paginação
 */
const getAtendimentos = (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      busca,
      status,
      area_juridica,
      advogado,
      data_inicio,
      data_fim,
      sort_by = 'data',
      sort_order = 'desc'
    } = req.query;

    let resultado = [...atendimentos];

    // Filtro de busca textual (cliente, advogado, área jurídica)
    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(item =>
        item.cliente.toLowerCase().includes(termo) ||
        item.advogado.toLowerCase().includes(termo) ||
        item.area_juridica.toLowerCase().includes(termo)
      );
    }

    // Filtro por status
    if (status) {
      resultado = resultado.filter(item => item.status === status);
    }

    // Filtro por área jurídica
    if (area_juridica) {
      resultado = resultado.filter(item => item.area_juridica === area_juridica);
    }

    // Filtro por advogado
    if (advogado) {
      resultado = resultado.filter(item => item.advogado === advogado);
    }

    // Filtro por período
    if (data_inicio) {
      resultado = resultado.filter(item => item.data >= data_inicio);
    }
    if (data_fim) {
      resultado = resultado.filter(item => item.data <= data_fim);
    }

    // Ordenação
    resultado.sort((a, b) => {
      let valA = a[sort_by];
      let valB = b[sort_by];

      if (sort_by === 'valor') {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sort_order === 'asc' ? -1 : 1;
      if (valA > valB) return sort_order === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginação
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Parâmetro "page" deve ser um número positivo' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Parâmetro "limit" deve ser entre 1 e 100' });
    }

    const total = resultado.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginado = resultado.slice(startIndex, startIndex + limitNum);

    res.json({
      data: paginado,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar atendimentos' });
  }
};

/**
 * Retorna um atendimento específico por ID
 */
const getAtendimentoById = (req, res) => {
  try {
    const { id } = req.params;
    const atendimento = atendimentos.find(item => item.id === parseInt(id));

    if (!atendimento) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }

    res.json({ data: atendimento });
  } catch (error) {
    console.error('Erro ao buscar atendimento:', error);
    res.status(500).json({ error: 'Erro interno ao buscar atendimento' });
  }
};

/**
 * Retorna métricas/KPIs do dashboard
 */
const getMetricas = (req, res) => {
  try {
    const total = atendimentos.length;
    const concluidos = atendimentos.filter(a => a.status === 'Concluído').length;
    const cancelados = atendimentos.filter(a => a.status === 'Cancelado').length;
    const agendados = atendimentos.filter(a => a.status === 'Agendado').length;
    const emAndamento = atendimentos.filter(a => a.status === 'Em andamento').length;
    const receitaTotal = atendimentos
      .filter(a => a.status === 'Concluído')
      .reduce((sum, a) => sum + a.valor, 0);

    // Distribuição por status
    const porStatus = [
      { status: 'Concluído', quantidade: concluidos },
      { status: 'Cancelado', quantidade: cancelados },
      { status: 'Agendado', quantidade: agendados },
      { status: 'Em andamento', quantidade: emAndamento }
    ];

    // Distribuição por área jurídica
    const areasMap = {};
    atendimentos.forEach(a => {
      areasMap[a.area_juridica] = (areasMap[a.area_juridica] || 0) + 1;
    });
    const porArea = Object.entries(areasMap).map(([area, quantidade]) => ({
      area,
      quantidade
    })).sort((a, b) => b.quantidade - a.quantidade);

    // Evolução mensal
    const mensalMap = {};
    atendimentos.forEach(a => {
      if (a.data) {
        const mesAno = a.data.substring(0, 7); // YYYY-MM
        mensalMap[mesAno] = (mensalMap[mesAno] || 0) + 1;
      }
    });
    const evolucaoMensal = Object.entries(mensalMap)
      .map(([mes, quantidade]) => ({ mes, quantidade }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    // Top advogados
    const advogadosMap = {};
    atendimentos.forEach(a => {
      advogadosMap[a.advogado] = (advogadosMap[a.advogado] || 0) + 1;
    });
    const topAdvogados = Object.entries(advogadosMap)
      .map(([advogado, quantidade]) => ({ advogado, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    res.json({
      data: {
        kpis: {
          totalAtendimentos: total,
          totalConcluidos: concluidos,
          totalCancelados: cancelados,
          totalAgendados: agendados,
          totalEmAndamento: emAndamento,
          receitaTotal: Math.round(receitaTotal * 100) / 100
        },
        porStatus,
        porArea,
        evolucaoMensal,
        topAdvogados
      }
    });
  } catch (error) {
    console.error('Erro ao calcular métricas:', error);
    res.status(500).json({ error: 'Erro interno ao calcular métricas' });
  }
};

/**
 * Retorna todos os atendimentos filtrados (sem paginação) para exportação
 */
const getExportacao = (req, res) => {
  try {
    const { busca, status, area_juridica, advogado, data_inicio, data_fim } = req.query;

    let resultado = [...atendimentos];

    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(item =>
        item.cliente.toLowerCase().includes(termo) ||
        item.advogado.toLowerCase().includes(termo) ||
        item.area_juridica.toLowerCase().includes(termo)
      );
    }

    if (status) {
      resultado = resultado.filter(item => item.status === status);
    }

    if (area_juridica) {
      resultado = resultado.filter(item => item.area_juridica === area_juridica);
    }

    if (advogado) {
      resultado = resultado.filter(item => item.advogado === advogado);
    }

    if (data_inicio) {
      resultado = resultado.filter(item => item.data >= data_inicio);
    }
    if (data_fim) {
      resultado = resultado.filter(item => item.data <= data_fim);
    }

    res.json({ data: resultado, total: resultado.length });
  } catch (error) {
    console.error('Erro ao exportar:', error);
    res.status(500).json({ error: 'Erro interno ao preparar exportação' });
  }
};

module.exports = {
  getAtendimentos,
  getAtendimentoById,
  getMetricas,
  getExportacao
};
