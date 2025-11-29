
import React, { useState } from 'react';
import { Prestador } from '../types';
import { Users, Plus, Phone, Truck } from 'lucide-react';
import { DEFAULT_PRICING } from '../constants';

interface PrestadoresProps {
  prestadores: Prestador[];
  onUpdate: (prestadores: Prestador[]) => void;
}

const Prestadores: React.FC<PrestadoresProps> = ({ prestadores, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ nome: '', tipo: 'Motorista', telefone: '' });

  const handleAdd = () => {
    if (formData.nome) {
      const newPrestador: Prestador = {
        id: Date.now(),
        ...formData,
        tabelaCustos: DEFAULT_PRICING // Default costs
      };
      onUpdate([...prestadores, newPrestador]);
      setFormData({ nome: '', tipo: 'Motorista', telefone: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Gestão de Prestadores
        </h2>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Prestador
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h4 className="font-bold mb-4">Cadastro de Prestador</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              className="px-4 py-2 border rounded-lg bg-white"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
            />
            <select 
              className="px-4 py-2 border rounded-lg bg-white"
              value={formData.tipo}
              onChange={e => setFormData({...formData, tipo: e.target.value})}
            >
              <option>Motorista</option>
              <option>Enfermeiro</option>
              <option>Médico</option>
              <option>Socorrista</option>
            </select>
            <input 
              className="px-4 py-2 border rounded-lg bg-white"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={e => setFormData({...formData, telefone: e.target.value})}
            />
          </div>
          <div className="flex gap-3 mt-4 justify-end">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 px-4">Cancelar</button>
            <button onClick={handleAdd} className="bg-emerald-600 text-white px-6 py-2 rounded-lg">Salvar Cadastro</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prestadores.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                <Truck className="w-6 h-6" />
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{p.tipo}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{p.nome}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
              <Phone className="w-4 h-4" /> {p.telefone}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
               <button className="w-full text-indigo-600 text-sm font-medium hover:bg-indigo-50 py-2 rounded-lg border border-transparent hover:border-indigo-100 transition-colors">
                 Ver Tabela de Custos
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prestadores;
