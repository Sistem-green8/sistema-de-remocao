import React, { useState } from 'react';
import { Remocao, Convenio } from '../types';
import { FileText, Printer, Search, Calendar, Filter, Download } from 'lucide-react';
import { formatBRL } from '../utils/pricing';

interface ReportGeneratorProps {
  remocoes: Remocao[];
  convenios: Convenio[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ remocoes, convenios }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    convenio: ''
  });

  const [generated, setGenerated] = useState(false);
  const [reportData, setReportData] = useState<Remocao[]>([]);

  const handleGenerate = () => {
    if (!filters.startDate || !filters.endDate) {
      alert("Por favor, selecione as datas de início e fim.");
      return;
    }

    const filtered = remocoes.filter(r => {
      // Filter by Date Range
      if (r.dataRemocao < filters.startDate) return false;
      if (r.dataRemocao > filters.endDate) return false;

      // Filter by Convenio (if selected)
      if (filters.convenio && r.solicitante !== filters.convenio) return false;

      return true;
    });

    setReportData(filtered);
    setGenerated(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=900,height=600');
    if (!printWindow) return;

    const totalValue = reportData.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Remoções</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { color: #64748b; margin-top: 5px; font-size: 14px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
          th { background: #f8fafc; text-align: left; padding: 10px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
          tr:nth-child(even) { background: #fcfcfc; }
          
          .summary { display: flex; justify-content: flex-end; margin-top: 20px; }
          .summary-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px 30px; border-radius: 8px; text-align: right; }
          .summary-label { font-size: 12px; color: #166534; font-weight: 600; text-transform: uppercase; }
          .summary-value { font-size: 24px; font-weight: 700; color: #15803d; }
          
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Relatório de Atendimentos</h1>
          <p class="subtitle">
            Período: ${new Date(filters.startDate).toLocaleDateString('pt-BR')} a ${new Date(filters.endDate).toLocaleDateString('pt-BR')}
            ${filters.convenio ? ` • Convênio: ${filters.convenio}` : ''}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Paciente</th>
              <th>Origem / Destino</th>
              <th>Convênio</th>
              <th>Status</th>
              <th style="text-align: right;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map(r => `
              <tr>
                <td>#${r.id}</td>
                <td>${new Date(r.dataRemocao).toLocaleDateString('pt-BR')}</td>
                <td>${r.paciente}</td>
                <td>${r.origem} → ${r.destino}</td>
                <td>${r.solicitante}</td>
                <td>${r.status}</td>
                <td style="text-align: right;">${formatBRL(r.valorTotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-box">
            <div class="summary-label">Valor Total do Período</div>
            <div class="summary-value">${formatBRL(totalValue)}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const totalValue = reportData.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Controls Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          Filtros do Relatório
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Convênio</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={filters.convenio}
              onChange={e => setFilters({...filters, convenio: e.target.value})}
            >
              <option value="">Todos os Convênios</option>
              {convenios.map(c => (
                <option key={c.id} value={c.nome}>{c.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Data Início</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={filters.startDate}
                onChange={e => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Data Final</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={filters.endDate}
                onChange={e => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Results */}
      {generated && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800">Resultado da Pesquisa</h3>
              <p className="text-xs text-slate-500">{reportData.length} registros encontrados</p>
            </div>
            {reportData.length > 0 && (
              <button 
                onClick={handlePrint}
                className="text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir PDF
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Origem / Destino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Convênio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {reportData.length > 0 ? (
                  reportData.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(r.dataRemocao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {r.paciente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex flex-col">
                          <span>{r.origem}</span>
                          <span className="text-xs text-slate-400">→ {r.destino}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                          {r.solicitante}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          r.status === 'Faturada' ? 'bg-purple-100 text-purple-800' :
                          r.status === 'Concluida' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-slate-700">
                        {formatBRL(r.valorTotal)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                )}
              </tbody>
              {reportData.length > 0 && (
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase">
                      Total do Período
                    </td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-indigo-700">
                      {formatBRL(totalValue)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
