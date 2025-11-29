import React, { useState } from 'react';
import { Remocao, StatusRemocao } from '../types';
import { MoreHorizontal, Clock, MapPin, User, Calculator } from 'lucide-react';

interface KanbanProps {
  remocoes: Remocao[];
  onStatusChange: (id: number, newStatus: StatusRemocao) => void;
  onFaturar: (id: number) => void;
}

const COLUMNS: StatusRemocao[] = ['Aberta', 'Em Andamento', 'Concluida'];

const Kanban: React.FC<KanbanProps> = ({ remocoes, onStatusChange, onFaturar }) => {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: StatusRemocao) => {
    if (draggedId) {
      if (status === 'Concluida') {
        // Trigger faturamento flow instead of direct drop if desired, 
        // but here we drop then user clicks faturar usually.
        // For this demo, let's just move it.
        onStatusChange(draggedId, status);
      } else {
        onStatusChange(draggedId, status);
      }
      setDraggedId(null);
    }
  };

  const getStatusColor = (status: StatusRemocao) => {
    switch(status) {
      case 'Aberta': return 'border-indigo-500 bg-indigo-50';
      case 'Em Andamento': return 'border-amber-500 bg-amber-50';
      case 'Concluida': return 'border-emerald-500 bg-emerald-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const items = remocoes.filter(r => r.status === col);
        return (
          <div 
            key={col}
            className="flex-shrink-0 w-80 flex flex-col bg-slate-100 rounded-xl border border-slate-200 shadow-inner"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col)}
          >
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
              <h3 className="font-bold text-slate-700">{col}</h3>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{items.length}</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-move hover:shadow-md transition-all ${getStatusColor(item.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500">#{item.id}</span>
                    {item.status === 'Concluida' && (
                      <button 
                        onClick={() => onFaturar(item.id)}
                        className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 flex items-center gap-1"
                      >
                        <Calculator className="w-3 h-3" /> Faturar
                      </button>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {item.paciente}
                  </h4>
                  
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate w-full">{item.origem} → {item.destino}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.horaOrigem}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">{item.solicitante}</span>
                    <span className="text-[10px] text-slate-400">{item.tipoVeiculo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Kanban;
