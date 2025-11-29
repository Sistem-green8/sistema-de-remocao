
import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, MapPin, User, Ambulance, FileSignature } from 'lucide-react';
import { Orcamento, Prioridade, TipoVeiculo, TipoViagem, CategoriaServico, Convenio } from '../types';
import { calcularPreco, formatBRL } from '../utils/pricing';

interface NewOrcamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orcamento: Orcamento) => void;
  convenios: Convenio[];
  initialData?: Orcamento | null;
}

const NewOrcamentoModal: React.FC<NewOrcamentoModalProps> = ({ isOpen, onClose, onSave, convenios, initialData }) => {
  const [formData, setFormData] = useState({
    paciente: '',
    origem: '',
    destino: '',
    solicitante: '',
    tipoVeiculo: 'Básica' as TipoVeiculo,
    tipoViagem: 'Ida' as TipoViagem,
    categoriaServico: 'Básica' as CategoriaServico,
    kmEstimado: '',
    observacao: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // Reset or Populate form
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        setFormData({
          paciente: initialData.paciente,
          origem: initialData.origem,
          destino: initialData.destino,
          solicitante: initialData.solicitante,
          tipoVeiculo: initialData.tipoVeiculo,
          tipoViagem: initialData.tipoViagem,
          categoriaServico: initialData.categoriaServico,
          kmEstimado: initialData.kmEstimado.toString(),
          observacao: initialData.observacao || ''
        });
        setCalculatedPrice(initialData.valorTotal);
      } else {
        // New Mode
        setFormData({
          paciente: '',
          origem: '',
          destino: '',
          solicitante: '',
          tipoVeiculo: 'Básica',
          tipoViagem: 'Ida',
          categoriaServico: 'Básica',
          kmEstimado: '',
          observacao: ''
        });
        setCalculatedPrice(null);
      }
    }
  }, [isOpen, initialData]);

  // Real-time calculation effect
  useEffect(() => {
    // Only calculate if data changed from initial or if it's new. 
    // We want to allow manual override if needed, but for now we stick to formula.
    if (formData.solicitante && formData.kmEstimado) {
      const preco = calcularPreco({
        solicitante: formData.solicitante,
        tipoViagem: formData.tipoViagem,
        categoriaServico: formData.categoriaServico,
        kmRodado: parseFloat(formData.kmEstimado),
        tempoParadaDestino: 0 // Budget usually doesn't include wait time initially
      }, convenios);
      
      setCalculatedPrice(preco.valorTotal);
    } else {
      setCalculatedPrice(null);
    }
  }, [formData.solicitante, formData.tipoViagem, formData.categoriaServico, formData.kmEstimado, convenios]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paciente || !formData.solicitante || !formData.kmEstimado) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const newOrcamento: Orcamento = {
      id: initialData ? initialData.id : Math.floor(Math.random() * 100000), // Keep ID if editing
      dataCriacao: initialData ? initialData.dataCriacao : new Date().toISOString().split('T')[0],
      status: initialData ? initialData.status : 'Aberto',
      paciente: formData.paciente,
      origem: formData.origem,
      destino: formData.destino,
      solicitante: formData.solicitante,
      tipoVeiculo: formData.tipoVeiculo,
      tipoViagem: formData.tipoViagem,
      categoriaServico: formData.categoriaServico,
      kmEstimado: parseFloat(formData.kmEstimado),
      valorTotal: calculatedPrice || 0,
      observacao: formData.observacao
    };

    onSave(newOrcamento);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-indigo-600" /> 
              {initialData ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            <p className="text-sm text-slate-500">
              {initialData ? `Editando proposta #${initialData.id}` : 'Crie uma proposta e calcule o valor instantaneamente.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="new-orcamento-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Cliente */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <User className="w-4 h-4" /> Cliente e Paciente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Paciente*</label>
                  <input 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="paciente"
                    value={formData.paciente}
                    onChange={handleChange}
                    required
                    placeholder="Nome do Paciente"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Convênio (Tabela de Preço)*</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="solicitante"
                    value={formData.solicitante}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    {convenios.map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trajeto */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <MapPin className="w-4 h-4" /> Trajeto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Origem</label>
                  <input 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="origem"
                    value={formData.origem}
                    onChange={handleChange}
                    placeholder="Ex: Hospital Central"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destino</label>
                  <input 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    placeholder="Ex: Residência"
                  />
                </div>
              </div>
            </div>

            {/* Serviço e Cálculo */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-indigo-100 pb-2">
                <Ambulance className="w-4 h-4" /> Serviço e Estimativa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo Veículo</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="tipoVeiculo"
                    value={formData.tipoVeiculo}
                    onChange={handleChange}
                  >
                    <option value="Básica">Básica</option>
                    <option value="UTI">UTI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="categoriaServico"
                    value={formData.categoriaServico}
                    onChange={handleChange}
                  >
                    <option value="Básica">Básica</option>
                    <option value="UTI - Adulto">UTI - Adulto</option>
                    <option value="UTI - Pediátrica">UTI - Pediátrica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Viagem</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="tipoViagem"
                    value={formData.tipoViagem}
                    onChange={handleChange}
                  >
                    <option value="Ida">Ida</option>
                    <option value="Ida e Volta">Ida e Volta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">KM Estimado*</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    name="kmEstimado"
                    value={formData.kmEstimado}
                    onChange={handleChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Live Price Display */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-full text-white shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-900 font-medium">Valor Estimado do Orçamento</p>
                    <p className="text-xs text-indigo-500">Calculado com base na tabela do convênio selecionado.</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-indigo-700">
                  {calculatedPrice !== null ? formatBRL(calculatedPrice) : 'R$ 0,00'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Observações Internas</label>
              <input 
                className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
              />
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
            form="new-orcamento-form"
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {initialData ? 'Atualizar Orçamento' : 'Gerar Orçamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrcamentoModal;
