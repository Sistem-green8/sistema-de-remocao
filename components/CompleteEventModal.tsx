
import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';

interface CompleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (valor: number) => void;
  eventName: string;
}

const CompleteEventModal: React.FC<CompleteEventModalProps> = ({ isOpen, onClose, onSave, eventName }) => {
  const [valor, setValor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum < 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    onSave(valorNum);
    setValor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-emerald-800">Concluir Evento</h2>
            <p className="text-xs text-emerald-600">{eventName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Valor Final a Receber (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="0,00"
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Este valor será registrado automaticamente no módulo financeiro como Receita.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Confirmar e Encerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteEventModal;
