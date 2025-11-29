
import React from 'react';
import { X, MapPin, Calendar, Clock, User, Ambulance, FileText, Activity } from 'lucide-react';
import { Remocao } from '../types';
import { formatBRL } from '../utils/pricing';

interface RemovalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Remocao | null;
}

const RemovalDetailsModal: React.FC<RemovalDetailsModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> 
              Detalhes da Remoção #{data.id}
            </h2>
            <p className="text-sm text-slate-500">
              Criado em {new Date(data.dataCriacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
          
          {/* Status Badge */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Atual</span>
               <div className="text-lg font-bold text-slate-800">{data.status}</div>
             </div>
             <div>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pagamento</span>
               <div className={`text-lg font-bold ${data.statusPgto === 'Recebido' ? 'text-emerald-600' : 'text-amber-600'}`}>
                 {data.statusPgto}
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paciente */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <User className="w-4 h-4" /> Paciente e Solicitante
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Paciente</label>
                  <p className="text-slate-800 font-medium">{data.paciente}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Prontuário</label>
                  <p className="text-slate-800 font-medium">{data.prontuario || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Solicitante</label>
                  <p className="text-slate-800 font-medium bg-slate-100 px-2 py-0.5 rounded inline-block">{data.solicitante}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Telefone</label>
                  <p className="text-slate-800 font-medium">{data.telefone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Logística */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <Clock className="w-4 h-4" /> Agendamento
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Data Remoção</label>
                  <div className="flex items-center gap-1 text-slate-800 font-medium">
                    <Calendar className="w-3 h-3" /> {new Date(data.dataRemocao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                 <div>
                  <label className="text-xs text-slate-500 font-semibold block">Prioridade</label>
                  <p className={`font-medium ${data.prioridade === 'Urgência' ? 'text-red-600' : 'text-slate-800'}`}>{data.prioridade}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Hora Origem</label>
                  <p className="text-slate-800 font-medium">{data.horaOrigem}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Hora Destino</label>
                  <p className="text-slate-800 font-medium">{data.horaDestino || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trajeto */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <MapPin className="w-4 h-4" /> Trajeto
              </h3>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">Origem</label>
                  <p className="text-slate-800 font-semibold">{data.origem}</p>
                </div>
                <div className="hidden md:block text-slate-300">➝</div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">Destino</label>
                  <p className="text-slate-800 font-semibold">{data.destino}</p>
                </div>
              </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <Ambulance className="w-4 h-4" /> Detalhes Técnicos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Veículo</label>
                  <p className="text-slate-800">{data.tipoVeiculo}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block">Categoria</label>
                  <p className="text-slate-800">{data.categoriaServico}</p>
                </div>
                 <div>
                  <label className="text-xs text-slate-500 font-semibold block">Viagem</label>
                  <p className="text-slate-800">{data.tipoViagem}</p>
                </div>
                 <div>
                  <label className="text-xs text-slate-500 font-semibold block">Equipe</label>
                  <p className="text-slate-800">{data.equipe || '-'}</p>
                </div>
              </div>
          </div>

          {/* Dados Financeiros (Se houver) */}
          {(data.status === 'Faturada' || data.status === 'Concluida') && (
            <div className="space-y-3">
               <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                  <FileText className="w-4 h-4" /> Dados de Faturamento
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <div>
                    <label className="text-xs text-indigo-400 font-bold uppercase block">KM Rodado</label>
                    <p className="text-indigo-900 font-bold">{data.kmRodado} km</p>
                  </div>
                  <div>
                    <label className="text-xs text-indigo-400 font-bold uppercase block">Tempo Parada</label>
                    <p className="text-indigo-900 font-bold">{data.tempoParadaDestino} min</p>
                  </div>
                   <div>
                    <label className="text-xs text-indigo-400 font-bold uppercase block">Taxa Saída</label>
                    <p className="text-indigo-900 font-bold">{formatBRL(data.taxaSaida)}</p>
                  </div>
                   <div>
                    <label className="text-xs text-indigo-400 font-bold uppercase block">Valor Total</label>
                    <p className="text-xl text-indigo-700 font-bold">{formatBRL(data.valorTotal)}</p>
                  </div>
                </div>
            </div>
          )}

           {/* Obs */}
           {data.observacao && (
            <div>
               <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Observações</h3>
               <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{data.observacao}</p>
            </div>
           )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemovalDetailsModal;
