
import React, { useState } from 'react';
import { Lancamento, Remocao, Convenio, TipoLancamento, StatusPgto } from '../types';
import { formatBRL } from '../utils/pricing';
import { ArrowUpRight, ArrowDownLeft, Filter, PlusCircle, MinusCircle, Clock, CalendarDays } from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';

interface FinancialsProps {
  remocoes: Remocao[]; // Contas a Receber
  lancamentos: Lancamento[]; // Contas a Pagar/Outros
  convenios: Convenio[];
  onAddLancamento: (l: Lancamento) => void;
  onUpdateStatus: (id: string | number, type: 'remocao' | 'lancamento') => void;
}

const Financials: React.FC<FinancialsProps> = ({ remocoes, lancamentos, convenios, onAddLancamento, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'receber' | 'pagar'>('receber');
  
  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'Despesa' as TipoLancamento,
    status: 'Pendente' as StatusPgto,
    title: ''
  });

  const openModal = (type: TipoLancamento, status: StatusPgto, title: string) => {
    setModalConfig({ type, status, title });
    setModalOpen(true);
  };

  // --- Filtering Logic ---

  // 1. Receivables (From Remocoes)
  const receivables = remocoes.filter(r => {
    if (r.status !== 'Faturada') return false;
    
    // Date Filter
    if (startDate && r.dataRemocao < startDate) return false;
    if (endDate && r.dataRemocao > endDate) return false;

    // Convenio Filter
    if (selectedConvenio && r.solicitante !== selectedConvenio) return false;

    return true;
  });

  // 2. Payables/Others (From Lancamentos)
  const payables = lancamentos.filter(l => {
    // Date Filter
    if (startDate && l.data < startDate) return false;
    if (endDate && l.data > endDate) return false;

    return true;
  });

  // --- Totals Calculation (Based on Filtered Data) ---
  const totalReceber = receivables.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
  
  // Calculate expenses/revenues from 'lancamentos'
  const totalDespesas = payables
    .filter(l => l.tipo === 'Despesa')
    .reduce((acc, curr) => acc + Math.abs(curr.valor), 0);
  
  const totalReceitasExtras = payables
    .filter(l => l.tipo === 'Receita')
    .reduce((acc, curr) => acc + Math.abs(curr.valor), 0);
  
  const saldo = (totalReceber + totalReceitasExtras) - totalDespesas;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Controls: Filters and Actions */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
            <Filter className="w-4 h-4" /> Filtros:
          </div>
          
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              className="bg-transparent text-sm outline-none text-slate-600"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <span className="text-slate-300">|</span>
            <input 
              type="date" 
              className="bg-transparent text-sm outline-none text-slate-600"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
            value={selectedConvenio}
            onChange={e => setSelectedConvenio(e.target.value)}
          >
            <option value="">Todos os Convênios</option>
            {convenios.map(c => (
              <option key={c.id} value={c.nome}>{c.nome}</option>
            ))}
          </select>
          
          {(startDate || endDate || selectedConvenio) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); setSelectedConvenio(''); }}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button 
            onClick={() => openModal('Despesa', 'Pago', 'Nova Despesa (Pago)')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 text-sm font-semibold transition-colors"
          >
            <MinusCircle className="w-4 h-4" /> Despesa
          </button>
          <button 
            onClick={() => openModal('Receita', 'Pago', 'Nova Receita (Recebido)')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 border border-emerald-200 text-sm font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Receita
          </button>
          <button 
            onClick={() => openModal('Despesa', 'Pendente', 'Conta a Pagar')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 border border-slate-200 text-sm font-semibold transition-colors shadow-sm"
          >
            <Clock className="w-4 h-4 text-red-500" /> Conta a Pagar
          </button>
          <button 
            onClick={() => openModal('Receita', 'Pendente', 'Conta a Receber (Extra)')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 border border-slate-200 text-sm font-semibold transition-colors shadow-sm"
          >
            <Clock className="w-4 h-4 text-emerald-500" /> Valor a Receber
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Receita Filtrada</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-emerald-700">{formatBRL(totalReceber + totalReceitasExtras)}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Remoções + Extras</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Despesas Filtradas</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-red-700">{formatBRL(totalDespesas)}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Saldo do Período</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-3xl font-bold ${saldo >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {formatBRL(saldo)}
            </span>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('receber')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'receber'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Contas a Receber (Remoções)
            </button>
            <button
              onClick={() => setActiveTab('pagar')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'pagar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Lançamentos (Pagar/Outros)
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'receber' ? (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Convênio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {receivables.length > 0 ? (
                  receivables.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{r.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{r.dataRemocao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{r.solicitante}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{r.paciente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-slate-700">{formatBRL(r.valorTotal)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          r.statusPgto === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {r.statusPgto}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {r.statusPgto !== 'Recebido' && (
                          <button 
                            onClick={() => onUpdateStatus(r.id, 'remocao')}
                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                          >
                            Receber
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Nenhum registro encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {payables.length > 0 ? (
                  payables.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{l.data}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{l.descricao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{l.categoria}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${l.valor < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formatBRL(l.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          l.statusPgto === 'Pago' || l.statusPgto === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {l.statusPgto}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         {(l.statusPgto !== 'Pago' && l.statusPgto !== 'Recebido') && (
                          <button 
                            onClick={() => onUpdateStatus(l.id, 'lancamento')}
                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                          >
                            {l.tipo === 'Despesa' ? 'Pagar' : 'Receber'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Nenhum lançamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NewTransactionModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(l) => { onAddLancamento(l); setModalOpen(false); }}
        initialType={modalConfig.type}
        initialStatus={modalConfig.status}
        title={modalConfig.title}
      />
    </div>
  );
};

export default Financials;
