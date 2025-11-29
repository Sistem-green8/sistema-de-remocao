
import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Calendar, Clock, Tent, UserPlus, Check } from 'lucide-react';
import { Evento, Prestador } from '../types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evento: Evento) => void;
  availablePrestadores: Prestador[];
  initialData?: Evento | null;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSave, availablePrestadores, initialData }) => {
  const [formData, setFormData] = useState({
    nome: '',
    local: '',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '',
    horaFim: '',
  });

  const [selectedPrestadores, setSelectedPrestadores] = useState<number[]>([]);

  // Reset or populate form when opening
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          nome: initialData.nome,
          local: initialData.local,
          data: initialData.data,
          horaInicio: initialData.horaInicio,
          horaFim: initialData.horaFim,
        });
        setSelectedPrestadores(initialData.prestadoresIds || []);
      } else {
        setFormData({
          nome: '',
          local: '',
          data: new Date().toISOString().split('T')[0],
          horaInicio: '',
          horaFim: '',
        });
        setSelectedPrestadores([]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const togglePrestador = (id: number) => {
    setSelectedPrestadores(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.local || !formData.horaInicio) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const newEvento: Evento = {
      id: initialData ? initialData.id : Date.now(),
      status: initialData ? initialData.status : 'Agendado',
      valor: initialData ? initialData.valor : 0,
      ...formData,
      prestadoresIds: selectedPrestadores
    };

    onSave(newEvento);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Tent className="w-5 h-5 text-indigo-600" /> 
              {initialData ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            <p className="text-sm text-slate-500">
              {initialData ? 'Atualize as informações do evento.' : 'Cadastre um novo evento e aloque a equipe.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="new-event-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-2">
                Dados Gerais
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Evento*</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Show no Estádio"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Local do Evento*</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Endereço ou nome do local"
                    value={formData.local}
                    onChange={e => setFormData({...formData, local: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Data*</label>
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
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Horário Início*</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      required
                      value={formData.horaInicio}
                      onChange={e => setFormData({...formData, horaInicio: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Horário Final</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      value={formData.horaFim}
                      onChange={e => setFormData({...formData, horaFim: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <UserPlus className="w-4 h-4" /> Alocar Prestadores
              </h3>
              
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 max-h-48 overflow-y-auto">
                {availablePrestadores.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center">Nenhum prestador cadastrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePrestadores.map(prestador => {
                      const isSelected = selectedPrestadores.includes(prestador.id);
                      return (
                        <div 
                          key={prestador.id}
                          onClick={() => togglePrestador(prestador.id)}
                          className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{prestador.nome}</p>
                            <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{prestador.tipo}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">Selecione os prestadores que trabalharão neste evento.</p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            form="new-event-form"
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {initialData ? 'Atualizar Evento' : 'Salvar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewEventModal;
