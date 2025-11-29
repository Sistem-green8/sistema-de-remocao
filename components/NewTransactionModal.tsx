
import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Lancamento, TipoLancamento, StatusPgto } from '../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lancamento: Lancamento) => void;
  initialType: TipoLancamento;
  initialStatus: StatusPgto;
  title: string;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ 
  isOpen, onClose, onSave, initialType, initialStatus, title 
}) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    categoria: '',
    valor: '',
  });

  // Reset form when modal opens with new props
  useEffect(() => {
    if (isOpen) {
      setFormData({
        data: new Date().toISOString().split('T')[0],
        descricao: '',
        categoria: '',
        valor: '',
      });
    }
  }, [isOpen, initialType, initialStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor) {
      alert('Preencha descrição e valor.');
      return;
    }

    const valorNum = parseFloat(formData.valor);
    
    const finalValue = initialType === 'Despesa' ? -Math.abs(valorNum) : Math.abs(valorNum);

    const newLancamento: Lancamento = {
      id: `L-${Date.now()}`,
      data: formData.data,
      tipo: initialType,
      categoria: formData.categoria || 'Geral',
      descricao: formData.descricao,
      valor: finalValue,
      statusPgto: initialStatus
    };

    onSave(newLancamento);
    onClose();
  };

  const isExpense = initialType === 'Despesa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isExpense ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div>
            <h2 className={`text-lg font-bold ${isExpense ? 'text-red-800' : 'text-emerald-800'}`}>{title}</h2>
            <p className="text-xs text-slate-500">
              {initialStatus === 'Pago' || initialStatus === 'Recebido' ? 'Lançamento imediato' : 'Agendamento futuro'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Valor (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="0,00"
                value={formData.valor}
                onChange={e => setFormData({...formData, valor: e.target.value})}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                required
                placeholder="Ex: Pagamento de Combustível"
                value={formData.descricao}
                onChange={e => setFormData({...formData, descricao: e.target.value})}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Ex: Transporte"
                  value={formData.categoria}
                  onChange={e => setFormData({...formData, categoria: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  required
                  value={formData.data}
                  onChange={e => setFormData({...formData, data: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-2.5 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 mt-4 ${
              isExpense 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            <Save className="w-4 h-4" />
            Confirmar Lançamento
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
