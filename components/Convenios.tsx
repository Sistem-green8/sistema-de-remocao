
import React, { useState } from 'react';
import { Convenio, PricingRule } from '../types';
import { Edit2, Plus, Check, X, ShieldCheck } from 'lucide-react';
import { DEFAULT_PRICING } from '../constants';

interface ConveniosProps {
  convenios: Convenio[];
  onUpdate: (convenios: Convenio[]) => void;
}

const Convenios: React.FC<ConveniosProps> = ({ convenios, onUpdate }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPricing, setTempPricing] = useState<PricingRule | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleEdit = (c: Convenio) => {
    setEditingId(c.id);
    setTempPricing(JSON.parse(JSON.stringify(c.tabelaPrecos))); // Deep copy
  };

  const handleSave = () => {
    if (editingId && tempPricing) {
      const updated = convenios.map(c => c.id === editingId ? { ...c, tabelaPrecos: tempPricing } : c);
      onUpdate(updated);
      setEditingId(null);
      setTempPricing(null);
    }
  };

  const handleAdd = () => {
    if (newName.trim()) {
      const newConvenio: Convenio = {
        id: Date.now(),
        nome: newName.toUpperCase(),
        ativo: true,
        tabelaPrecos: DEFAULT_PRICING
      };
      onUpdate([...convenios, newConvenio]);
      setNewName('');
      setIsAdding(false);
    }
  };

  const updatePrice = (path: string, val: string) => {
    if (!tempPricing) return;
    const value = parseFloat(val) || 0;
    
    const parts = path.split('.');
    if (parts[0] === 'KM') {
      setTempPricing({ ...tempPricing, KM: { ...tempPricing.KM, [parts[1]]: value } });
    } else if (parts[0] === 'HORA_PARADA') {
      setTempPricing({ ...tempPricing, HORA_PARADA: { ...tempPricing.HORA_PARADA, [parts[1]]: value } });
    }
    // Simplification: Not implementing full deep edit for TAXA_SAIDA UI in this snippet due to size
    // but demonstrating the capability for KM and Hours.
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          Gestão de Convênios e Tabelas
        </h2>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Convênio
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center animate-in slide-in-from-top-4">
          <input 
            className="flex-1 px-4 py-2 border rounded-lg bg-white"
            placeholder="Nome do Convênio (ex: UNIMED)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button onClick={handleAdd} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Salvar</button>
          <button onClick={() => setIsAdding(false)} className="text-slate-500 px-4">Cancelar</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {convenios.map(c => (
          <div key={c.id} className={`bg-white rounded-xl border transition-all ${editingId === c.id ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 shadow-sm'}`}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <h3 className="font-bold text-lg text-slate-800">{c.nome}</h3>
              {editingId === c.id ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Salvar Tabela</button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                </div>
              ) : (
                <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 border border-indigo-200">
                  <Edit2 className="w-4 h-4" /> Editar Preços
                </button>
              )}
            </div>
            
            <div className="p-6">
               {editingId === c.id && tempPricing ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-500 text-xs uppercase mb-3 border-b pb-1">Valor do KM (R$)</h4>
                      {Object.entries(tempPricing.KM).map(([cat, val]) => (
                        <div key={cat} className="flex justify-between items-center mb-2">
                          <label className="text-sm text-slate-700">{cat}</label>
                          <input 
                            type="number" step="0.01" 
                            className="w-24 p-1 border rounded text-right bg-white"
                            value={val}
                            onChange={(e) => updatePrice(`KM.${cat}`, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-500 text-xs uppercase mb-3 border-b pb-1">Valor Hora Parada (R$)</h4>
                      {Object.entries(tempPricing.HORA_PARADA).map(([cat, val]) => (
                        <div key={cat} className="flex justify-between items-center mb-2">
                          <label className="text-sm text-slate-700">{cat}</label>
                          <input 
                            type="number" step="0.01" 
                            className="w-24 p-1 border rounded text-right bg-white"
                            value={val}
                            onChange={(e) => updatePrice(`HORA_PARADA.${cat}`, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="block text-xs text-slate-500 font-bold uppercase mb-1">KM Básica</span>
                      <span className="text-lg font-mono text-slate-700">R$ {c.tabelaPrecos.KM['Básica'].toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="block text-xs text-slate-500 font-bold uppercase mb-1">KM UTI Adulto</span>
                      <span className="text-lg font-mono text-slate-700">R$ {c.tabelaPrecos.KM['UTI - Adulto'].toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Hora Parada (UTI)</span>
                      <span className="text-lg font-mono text-slate-700">R$ {c.tabelaPrecos.HORA_PARADA['UTI - Adulto'].toFixed(2)}</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Convenios;
