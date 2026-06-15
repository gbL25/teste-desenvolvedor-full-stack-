import { useState } from 'react';
import { getExportacao } from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiDownload } from 'react-icons/fi';

function ExportButtons({ filters }) {
  const [exporting, setExporting] = useState(false);

  const fetchExportData = async () => {
    const params = {};
    if (filters.busca) params.busca = filters.busca;
    if (filters.status) params.status = filters.status;
    if (filters.area_juridica) params.area_juridica = filters.area_juridica;

    const result = await getExportacao(params);
    return result.data;
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const data = await fetchExportData();

      const headers = ['ID', 'Cliente', 'CPF', 'Data', 'Hora Início', 'Hora Fim', 'Advogado', 'Área Jurídica', 'Status', 'Valor'];
      const rows = data.map(item => [
        item.id,
        item.cliente,
        item.cpf,
        item.data,
        item.hora_inicio,
        item.hora_fim,
        item.advogado,
        item.area_juridica,
        item.status,
        item.valor
      ]);

      const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
      ].join('\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `atendimentos_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao exportar CSV. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const data = await fetchExportData();

      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('Relatório de Atendimentos Jurídicos', 14, 15);
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);
      doc.text(`Total de registros: ${data.length}`, 14, 28);

      const tableData = data.map(item => [
        item.cliente.substring(0, 30),
        item.data,
        `${item.hora_inicio}-${item.hora_fim}`,
        item.advogado.substring(0, 25),
        item.area_juridica,
        item.status,
        `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ]);

      autoTable(doc, {
        head: [['Cliente', 'Data', 'Horário', 'Advogado', 'Área', 'Status', 'Valor']],
        body: tableData,
        startY: 33,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246] },
        alternateRowStyles: { fillColor: [245, 247, 250] }
      });

      doc.save(`atendimentos_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      alert('Erro ao exportar PDF. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-buttons">
      <button onClick={exportCSV} disabled={exporting} className="btn-export btn-csv">
        <FiDownload /> CSV
      </button>
      <button onClick={exportPDF} disabled={exporting} className="btn-export btn-pdf">
        <FiDownload /> PDF
      </button>
    </div>
  );
}

export default ExportButtons;
