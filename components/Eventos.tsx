
import React from 'react';
import { Evento, Prestador } from '../types';
import { MapPin, Calendar, Clock, Users, Tent, Edit, CheckCircle, DollarSign } from 'lucide-react';
import { formatBRL } from '../utils/pricing';

interface EventosProps {
  eventos: Evento[];
  prestadores: Prestador[];
  onEdit: (evento: Evento) => void;
  onOpenCompleteModal: (evento: Evento) => void;
}

const Eventos: React.FC<EventosProps> = ({ eventos, prestadores, onEdit, onOpenCompleteModal }) => {
  const getPrestadoresNames = (ids: number[]) => {
    return ids.map(id => {
      const p = prestadores.find(prest => prest.id === id);
      return p ? p.nome : 'Desconhecido';
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            <Tent className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Nenhum evento agendado.</p>
          </div>
        ) : (
          eventos.map(evento => {
            const teamNames = getPrestadoresNames(evento.prestadoresIds);
            const isConcluido = evento.status === 'Concluído';
            
            return (
              <div key={evento.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{evento.nome}</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-1">
                      <Calendar className="w-3 h-3" /> {evento.data}
                    </div>
                  </div>
                  <div className={`p-2 rounded-full border shadow-sm ${isConcluido ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-indigo-500'}`}>
                    {isConcluido ? <CheckCircle className="w-5 h-5" /> : <Tent className="w-5 h-5" />}
                  </div>
                </div>
                
                <div className="p-4 flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Local</p>
                        <p className="text-sm text-slate-700">{evento.local}</p>
                      </div>
                    </div>
                    {isConcluido && (
                       <div className="text-right">
                         <p className="text-xs text-emerald-600 font-semibold uppercase">Valor</p>
                         <p className="text-sm font-bold text-emerald-700">{formatBRL(evento.valor)}</p>
                       </div>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Horário</p>
                      <p className="text-sm text-slate-700">{evento.horaInicio} - {evento.horaFim || '?'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <p className="text-xs text-slate-500 font-semibold uppercase">Equipe Alocada ({teamNames.length})</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {teamNames.length > 0 ? (
                        teamNames.map((name, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                            {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhum prestador alocado.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(evento)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  
                  {!isConcluido && (
                    <button 
                      onClick={() => onOpenCompleteModal(evento)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <DollarSign className="w-4 h-4" /> Concluir
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Eventos;
