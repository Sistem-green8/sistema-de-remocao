
import React, { useState } from 'react';
import { Orcamento, StatusOrcamento } from '../types';
import { FileSignature, CheckCircle, Clock, FileText, Printer, ArrowRight, Edit } from 'lucide-react';
import { formatBRL } from '../utils/pricing';

interface OrcamentosProps {
  orcamentos: Orcamento[];
  onUpdateStatus: (id: number, status: StatusOrcamento) => void;
  onEdit: (orcamento: Orcamento) => void;
}

const Orcamentos: React.FC<OrcamentosProps> = ({ orcamentos, onUpdateStatus, onEdit }) => {
  const [activeTab, setActiveTab] = useState<StatusOrcamento>('Aberto');

  const filtered = orcamentos.filter(o => o.status === activeTab);

  const stats = {
    aberto: orcamentos.filter(o => o.status === 'Aberto').length,
    aprovado: orcamentos.filter(o => o.status === 'Aprovado').length,
    faturado: orcamentos.filter(o => o.status === 'Faturado').length
  };

  const handlePrint = (orcamento: Orcamento) => {
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orçamento #${orcamento.id}</title>
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
          
          .route-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .route-flex { display: flex; align-items: center; justify-content: space-between; }
          .arrow { font-size: 20px; color: #94a3b8; padding: 0 20px; }
          
          .total-box { text-align: right; border-top: 2px solid #e2e8f0; padding-top: 20px; }
          .total-label { font-size: 14px; color: #64748b; }
          .total-value { font-size: 32px; font-weight: 700; color: #4f46e5; margin-top: 5px; }
          
          .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Gestor Pro</div>
          <div class="doc-title">
            <h1>Orçamento de Remoção</h1>
            <p>Proposta #${orcamento.id} • Data: ${new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div class="grid">
          <div class="col">
            <div class="label">Solicitante (Convênio)</div>
            <div class="value">${orcamento.solicitante}</div>
            
            <div class="label">Paciente</div>
            <div class="value">${orcamento.paciente}</div>
          </div>
          <div class="col">
            <div class="label">Tipo de Veículo</div>
            <div class="value">${orcamento.tipoVeiculo}</div>
            
            <div class="label">Categoria do Serviço</div>
            <div class="value">${orcamento.categoriaServico}</div>
          </div>
          <div class="col">
            <div class="label">Tipo de Viagem</div>
            <div class="value">${orcamento.tipoViagem}</div>
            
            <div class="label">Distância Estimada</div>
            <div class="value">${orcamento.kmEstimado} KM</div>
          </div>
        </div>

        <div class="route-box">
          <div class="label" style="margin-bottom: 10px;">Detalhes do Trajeto</div>
          <div class="route-flex">
            <div>
              <div class="label">Origem</div>
              <div class="value" style="font-size: 18px;">${orcamento.origem}</div>
            </div>
            <div class="arrow">➝</div>
            <div style="text-align: right;">
              <div class="label">Destino</div>
              <div class="value" style="font-size: 18px;">${orcamento.destino}</div>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="total-label">Valor Total Estimado</div>
          <div class="total-value">${formatBRL(orcamento.valorTotal)}</div>
          <p style="color: #64748b; font-size: 12px; margin-top: 5px;">*Valor sujeito a alterações caso haja mudança no trajeto ou tempo de espera.</p>
        </div>

        <div style="margin-top: 50px;">
           <div class="label">Observações</div>
           <p style="font-size: 14px; color: #334155; line-height: 1.5;">${orcamento.observacao || 'Nenhuma observação adicional.'}</p>
        </div>

        <div class="footer">
          <p>Este documento é uma proposta comercial e tem validade de 15 dias.</p>
          <p>Gestor Pro • Soluções em Transporte Médico</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Abertos</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.aberto}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Aprovados</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.aprovado}</h3>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Faturados</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.faturado}</h3>
          </div>
          <div className="bg-purple-50 p-3 rounded-full text-purple-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            {(['Aberto', 'Aprovado', 'Faturado'] as StatusOrcamento[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab === 'Aberto' && <Clock className="w-4 h-4" />}
                {tab === 'Aprovado' && <CheckCircle className="w-4 h-4" />}
                {tab === 'Faturado' && <FileText className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Origem / Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Convênio</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Estimado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filtered.length > 0 ? (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{o.dataCriacao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{o.paciente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex flex-col">
                        <span>{o.origem}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {o.destino}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                       <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{o.solicitante}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-indigo-600">{formatBRL(o.valorTotal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(o)}
                        className="text-slate-400 hover:text-indigo-600 p-1 border border-slate-200 rounded hover:border-indigo-200"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => handlePrint(o)}
                        className="text-slate-400 hover:text-slate-600 p-1 border border-slate-200 rounded hover:border-slate-300"
                        title="Imprimir PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      
                      {o.status === 'Aberto' && (
                        <button 
                          onClick={() => onUpdateStatus(o.id, 'Aprovado')}
                          className="text-emerald-600 hover:text-emerald-800 p-1 font-semibold text-xs border border-emerald-200 rounded px-2 bg-emerald-50"
                        >
                          Aprovar
                        </button>
                      )}
                      {o.status === 'Aprovado' && (
                        <button 
                          onClick={() => onUpdateStatus(o.id, 'Faturado')}
                          className="text-purple-600 hover:text-purple-800 p-1 font-semibold text-xs border border-purple-200 rounded px-2 bg-purple-50"
                        >
                          Faturar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <FileSignature className="w-12 h-12 text-slate-300 mb-3" />
                      <p>Nenhum orçamento {activeTab.toLowerCase()} encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orcamentos;
