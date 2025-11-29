
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, User, Ambulance, Trash2 } from 'lucide-react';
import { Remocao, Prioridade, TipoVeiculo, TipoViagem, CategoriaServico } from '../types';
import { MOCK_CONVENIOS } from '../constants'; // Using mock for dropdown population in this version

interface NewRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (remocao: Remocao) => void;
  onCancel?: (id: number) => void;
  initialData?: Remocao | null;
}

const NewRemovalModal: React.FC<NewRemovalModalProps> = ({ isOpen, onClose, onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    dataRemocao: new Date().toISOString().split('T')[0],
    horaOrigem: '',
    horaDestino: '',
    origem: '',
    destino: '',
    prioridade: 'Rotina' as Prioridade,
    paciente: '',
    prontuario: '',
    solicitante: '',
    telefone: '',
    tipoVeiculo: 'Básica' as TipoVeiculo,
    tipoViagem: 'Ida' as TipoViagem,
    categoriaServico: 'Básica' as CategoriaServico,
    equipe: '',
    justificativa: '',
    observacao: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          dataRemocao: initialData.dataRemocao,
          horaOrigem: initialData.horaOrigem,
          horaDestino: initialData.horaDestino,
          origem: initialData.origem,
          destino: initialData.destino,
          prioridade: initialData.prioridade,
          paciente: initialData.paciente,
          prontuario: initialData.prontuario,
          solicitante: initialData.solicitante,
          telefone: initialData.telefone,
          tipoVeiculo: initialData.tipoVeiculo,
          tipoViagem: initialData.tipoViagem,
          categoriaServico: initialData.categoriaServico,
          equipe: initialData.equipe,
          justificativa: initialData.justificativa,
          observacao: initialData.observacao
        });
      } else {
        // Reset for new entry
        setFormData({
          dataRemocao: new Date().toISOString().split('T')[0],
          horaOrigem: '',
          horaDestino: '',
          origem: '',
          destino: '',
          prioridade: 'Rotina',
          paciente: '',
          prontuario: '',
          solicitante: '',
          telefone: '',
          tipoVeiculo: 'Básica',
          tipoViagem: 'Ida',
          categoriaServico: 'Básica',
          equipe: '',
          justificativa: '',
          observacao: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.paciente || !formData.origem || !formData.destino || !formData.solicitante) {
      alert('Por favor, preencha os campos obrigatórios (*)');
      return;
    }

    const newRemocao: Remocao = {
      id: initialData ? initialData.id : Math.floor(Math.random() * 100000), 
      dataCriacao: initialData ? initialData.dataCriacao : new Date().toISOString().split('T')[0],
      status: initialData ? initialData.status : 'Aberta',
      logStatus: initialData ? initialData.logStatus : `Criado em ${new Date().toLocaleString()}`,
      ...formData,
      // Preserve financial values if editing, else default
      tempoParadaDestino: initialData ? initialData.tempoParadaDestino : 0,
      kmRodado: initialData ? initialData.kmRodado : 0,
      taxaSaida: initialData ? initialData.taxaSaida : 0,
      valorKm: initialData ? initialData.valorKm : 0,
      valorParada: initialData ? initialData.valorParada : 0,
      valorTotal: initialData ? initialData.valorTotal : 0,
      statusPgto: initialData ? initialData.statusPgto : 'A Receber'
    };

    onSave(newRemocao);
  };

  const handleCancelRemoval = () => {
    if (initialData && onCancel) {
      if (window.confirm("Tem certeza que deseja cancelar este atendimento? O status será alterado para 'Cancelada'.")) {
        onCancel(initialData.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Editar Remoção' : 'Nova Remoção'}
            </h2>
            <p className="text-sm text-slate-500">
              {initialData ? `Editando registro #${initialData.id}` : 'Preencha os dados para agendar um novo transporte.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="new-removal-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Logistics */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <MapPin className="w-4 h-4" /> Logística e Agendamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Data Remoção*</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      name="dataRemocao"
                      required
                      value={formData.dataRemocao}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Hora na Origem*</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      name="horaOrigem"
                      required
                      value={formData.horaOrigem}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Hora no Destino</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      name="horaDestino"
                      value={formData.horaDestino}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prioridade</label>
                  <select 
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Rotina">Rotina</option>
                    <option value="Urgência">Urgência</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Origem*</label>
                  <input 
                    type="text" 
                    name="origem"
                    required
                    placeholder="Ex: Hospital Central"
                    value={formData.origem}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destino*</label>
                  <input 
                    type="text" 
                    name="destino"
                    required
                    placeholder="Ex: Residência"
                    value={formData.destino}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Patient */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <User className="w-4 h-4" /> Paciente e Solicitante
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Paciente*</label>
                  <input 
                    type="text" 
                    name="paciente"
                    required
                    value={formData.paciente}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prontuário</label>
                  <input 
                    type="text" 
                    name="prontuario"
                    value={formData.prontuario}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Solicitante (Convênio)*</label>
                  <select 
                    name="solicitante"
                    required
                    value={formData.solicitante}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Selecione um convênio...</option>
                    {MOCK_CONVENIOS.map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Telefone Contato</label>
                  <input 
                    type="text" 
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <Ambulance className="w-4 h-4" /> Detalhes da Remoção
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo Veículo</label>
                  <select 
                    name="tipoVeiculo"
                    value={formData.tipoVeiculo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Básica">Básica</option>
                    <option value="UTI">UTI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo Viagem</label>
                  <select 
                    name="tipoViagem"
                    value={formData.tipoViagem}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Ida">Ida</option>
                    <option value="Ida e Volta">Ida e Volta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria Serviço</label>
                  <select 
                    name="categoriaServico"
                    value={formData.categoriaServico}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Básica">Básica</option>
                    <option value="UTI - Adulto">UTI - Adulto</option>
                    <option value="UTI - Pediátrica">UTI - Pediátrica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Equipe</label>
                  <input 
                    type="text" 
                    name="equipe"
                    value={formData.equipe}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Justificativa</label>
                  <input 
                    type="text" 
                    name="justificativa"
                    value={formData.justificativa}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Observação</label>
                  <input 
                    type="text" 
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
          <div>
            {initialData && onCancel && (
              <button 
                type="button"
                onClick={handleCancelRemoval}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Cancelar Atendimento
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
              Fechar
            </button>
            <button 
              form="new-removal-form"
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRemovalModal;
    