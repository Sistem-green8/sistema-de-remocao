
import React, { useState } from 'react';
import { Remocao } from '../types';
import { Search, Filter, Eye, Printer, Edit, MapPin, User, Clock, Ambulance } from 'lucide-react';
import { formatBRL } from '../utils/pricing';

interface TransportListProps {
  remocoes: Remocao[];
  onView: (id: number) => void;
  onEdit: (remocao: Remocao) => void;
}

const TransportList: React.FC<TransportListProps> = ({ remocoes, onView, onEdit }) => {
  const [term, setTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = remocoes.filter(r => {
    const matchesTerm = 
      r.paciente.toLowerCase().includes(term.toLowerCase()) || 
      r.solicitante.toLowerCase().includes(term.toLowerCase()) ||
      r.id.toString().includes(term);
    
    const matchesStatus = statusFilter === 'Todos' || r.status === statusFilter;
    
    return matchesTerm && matchesStatus;
  });

  const handlePrint = (r: Remocao) => {
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Remoção #${r.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: start; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; text-transform: uppercase; }
          .doc-title { text-align: right; }
          .doc-title h1 { margin: 0; font-size: 24px; color: #334155; }
          .doc-title p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
          
          .grid { display: flex; margin-bottom: 30px; gap: 40px; }
          .col { flex: 1; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 500; color: #0f172a; margin-bottom: 12px; }
          
          .status-box { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #f1f5f9; color: #475569; margin-bottom: 20px;}
          
          .route-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .route-flex { display: flex; align-items: center; justify-content: space-between; }
          .arrow { font-size: 20px; color: #94a3b8; padding: 0 20px; }
          
          .financial-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin-top: 30px; }
          .financial-title { font-size: 14px; font-weight: bold; color: #166534; margin-bottom: 15px; border-bottom: 1px solid #bbf7d0; padding-bottom: 10px; }
          .total-value { font-size: 24px; font-weight: 700; color: #15803d; }
          
          .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Gestor Pro</div>
          <div class="doc-title">
            <h1>Ordem de Serviço</h1>
            <p>Atendimento #${r.id} • Data: ${new Date(r.dataRemocao).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div class="status-box">STATUS: ${r.status.toUpperCase()}</div>

        <div class="grid">
          <div class="col">
            <div class="label">Solicitante (Convênio)</div>
            <div class="value">${r.solicitante}</div>
            
            <div class="label">Paciente</div>
            <div class="value">${r.paciente}</div>

             <div class="label">Prontuário</div>
            <div class="value">${r.prontuario || '-'}</div>
          </div>
          <div class="col">
            <div class="label">Tipo de Veículo</div>
            <div class="value">${r.tipoVeiculo}</div>
            
            <div class="label">Categoria</div>
            <div class="value">${r.categoriaServico}</div>

            <div class="label">Equipe</div>
            <div class="value">${r.equipe || '-'}</div>
          </div>
          <div class="col">
            <div class="label">Tipo de Viagem</div>
            <div class="value">${r.tipoViagem}</div>
            
            <div class="label">Prioridade</div>
            <div class="value">${r.prioridade}</div>

            <div class="label">Telefone</div>
            <div class="value">${r.telefone || '-'}</div>
          </div>
        </div>

        <div class="route-box">
          <div class="label" style="margin-bottom: 10px;">Detalhes do Trajeto</div>
          <div class="route-flex">
            <div>
              <div class="label">Origem (${r.horaOrigem})</div>
              <div class="value" style="font-size: 18px;">${r.origem}</div>
            </div>
            <div class="arrow">➝</div>
            <div style="text-align: right;">
              <div class="label">Destino (${r.horaDestino || '--:--'})</div>
              <div class="value" style="font-size: 18px;">${r.destino}</div>
            </div>
          </div>
        </div>
        
        ${r.observacao ? `
          <div style="margin-bottom: 20px;">
             <div class="label">Observações</div>
             <p style="font-size: 14px; color: #334155; background: #f8fafc; padding: 10px; border-radius: 4px;">${r.observacao}</p>
          </div>
        ` : ''}

        ${(r.status === 'Faturada' || r.status === 'Concluida') ? `
          <div class="financial-box">
            <div class="financial-title">Dados de Fechamento</div>
            <div class="grid" style="margin-bottom: 0;">
               <div class="col">
                  <div class="label">KM Rodado</div>
                  <div class="value">${r.kmRodado} km</div>
               </div>
               <div class="col">
                  <div class="label">Tempo Parada</div>
                  <div class="value">${r.tempoParadaDestino} min</div>
               </div>
               <div class="col" style="text-align: right;">
                  <div class="label">Valor Total</div>
                  <div class="total-value">${formatBRL(r.valorTotal)}</div>
               </div>
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Relatório gerado automaticamente pelo sistema Gestor Pro.</p>
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por paciente, convênio ou ID..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm bg-white"
            value={term}
            onChange={e => setTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-slate-400 w-5 h-5" />
          <select 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos Status</option>
            <option value="Aberta">Aberta</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluida">Concluída</option>
            <option value="Faturada">Faturada</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Origem/Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Convênio</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">#{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.dataRemocao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {r.paciente}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {r.origem}</span>
                    <span className="text-xs text-slate-400 pl-4">→ {r.destino}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{r.solicitante}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    r.status === 'Aberta' ? 'bg-indigo-100 text-indigo-800' :
                    r.status === 'Concluida' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'Faturada' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onView(r.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(r)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handlePrint(r)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Imprimir"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportList;
