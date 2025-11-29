
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import TransportList from './components/TransportList';
import Financials from './components/Financials';
import NewRemovalModal from './components/NewRemovalModal';
import CalendarView from './components/CalendarView';
import Convenios from './components/Convenios';
import Prestadores from './components/Prestadores';
import Eventos from './components/Eventos';
import NewEventModal from './components/NewEventModal';
import UserManagement from './components/UserManagement';
import Orcamentos from './components/Orcamentos';
import NewOrcamentoModal from './components/NewOrcamentoModal';
import RemovalDetailsModal from './components/RemovalDetailsModal';
import ReportGenerator from './components/ReportGenerator';
import CompleteEventModal from './components/CompleteEventModal'; // Import
import { Remocao, Lancamento, StatusRemocao, Convenio, Prestador, Evento, User, Orcamento, StatusOrcamento } from './types';
import { MOCK_REMOCOES, MOCK_LANCAMENTOS, MOCK_CONVENIOS, MOCK_PRESTADORES, MOCK_EVENTOS, MOCK_USERS, MOCK_ORCAMENTOS } from './constants';
import { calcularPreco } from './utils/pricing';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [remocoes, setRemocoes] = useState<Remocao[]>(MOCK_REMOCOES);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(MOCK_ORCAMENTOS);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(MOCK_LANCAMENTOS);
  const [convenios, setConvenios] = useState<Convenio[]>(MOCK_CONVENIOS);
  const [prestadores, setPrestadores] = useState<Prestador[]>(MOCK_PRESTADORES);
  const [eventos, setEventos] = useState<Evento[]>(MOCK_EVENTOS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isNewOrcamentoModalOpen, setIsNewOrcamentoModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCompleteEventModalOpen, setIsCompleteEventModalOpen] = useState(false);
  
  // State for Editing/Viewing
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null);
  const [editingRemoval, setEditingRemoval] = useState<Remocao | null>(null);
  const [viewingRemoval, setViewingRemoval] = useState<Remocao | null>(null);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [completingEvent, setCompletingEvent] = useState<Evento | null>(null);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  const updateStatus = (id: number, newStatus: StatusRemocao) => {
    setRemocoes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const faturarRemocao = (id: number) => {
    const km = parseFloat(prompt("Informe o KM Total:", "0") || "0");
    const tempo = parseFloat(prompt("Informe o Tempo de Parada (min):", "0") || "0");

    setRemocoes(prev => prev.map(r => {
      if (r.id === id) {
        // Calculate Price dynamically using CURRENT convenios state
        const calculo = calcularPreco({ 
          ...r, 
          kmRodado: km, 
          tempoParadaDestino: tempo 
        }, convenios);

        return {
          ...r,
          status: 'Faturada',
          kmRodado: km,
          tempoParadaDestino: tempo,
          taxaSaida: calculo.taxaSaida,
          valorKm: calculo.valorKm,
          valorParada: calculo.valorParada,
          valorTotal: calculo.valorTotal,
          statusPgto: 'A Receber'
        };
      }
      return r;
    }));
  };

  const updateFinanceStatus = (id: string | number, type: 'remocao' | 'lancamento') => {
    if (type === 'remocao') {
      setRemocoes(prev => prev.map(r => r.id === id ? { ...r, statusPgto: 'Recebido' } : r));
    } else {
      setLancamentos(prev => prev.map(l => l.id === id ? { ...l, statusPgto: 'Pago' } : l));
    }
  };

  const handleAddLancamento = (l: Lancamento) => {
    setLancamentos([...lancamentos, l]);
  };

  const handleSaveNewRemoval = (newRemocao: Remocao) => {
    if (editingRemoval) {
      // Update existing
      setRemocoes(prev => prev.map(r => r.id === newRemocao.id ? newRemocao : r));
    } else {
      // Create new
      setRemocoes([newRemocao, ...remocoes]);
    }
    setIsNewModalOpen(false);
    setEditingRemoval(null);
  };

  const handleEditRemoval = (remocao: Remocao) => {
    setEditingRemoval(remocao);
    setIsNewModalOpen(true);
  };

  const handleViewRemoval = (id: number) => {
    const found = remocoes.find(r => r.id === id);
    if (found) {
      setViewingRemoval(found);
      setIsViewModalOpen(true);
    }
  };

  const handleSaveNewEvent = (savedEvent: Evento) => {
    if (editingEvent) {
      // Update existing
      setEventos(prev => prev.map(e => e.id === savedEvent.id ? savedEvent : e));
    } else {
      // Create new
      setEventos([savedEvent, ...eventos]);
    }
    setIsNewEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (evento: Evento) => {
    setEditingEvent(evento);
    setIsNewEventModalOpen(true);
  };

  const handleOpenCompleteEventModal = (evento: Evento) => {
    setCompletingEvent(evento);
    setIsCompleteEventModalOpen(true);
  };

  const handleCompleteEventSave = (valor: number) => {
    if (!completingEvent) return;

    // 1. Update Event
    setEventos(prev => prev.map(e => e.id === completingEvent.id ? { ...e, status: 'Concluído', valor: valor } : e));

    // 2. Add Revenue Record to Finance
    const newLancamento: Lancamento = {
      id: `EV-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      tipo: 'Receita',
      categoria: 'Evento',
      descricao: `Receita Evento: ${completingEvent.nome}`,
      valor: valor,
      statusPgto: 'A Receber' 
    };
    
    setLancamentos(prev => [...prev, newLancamento]);
    setIsCompleteEventModalOpen(false);
    setCompletingEvent(null);
  };

  const handleSaveOrcamento = (savedOrcamento: Orcamento) => {
    if (editingOrcamento) {
      // Update existing
      setOrcamentos(prev => prev.map(o => o.id === savedOrcamento.id ? savedOrcamento : o));
    } else {
      // Create new
      setOrcamentos([savedOrcamento, ...orcamentos]);
    }
    setIsNewOrcamentoModalOpen(false);
    setEditingOrcamento(null);
  };
  
  const handleEditOrcamento = (orcamento: Orcamento) => {
    setEditingOrcamento(orcamento);
    setIsNewOrcamentoModalOpen(true);
  };

  const updateOrcamentoStatus = (id: number, status: StatusOrcamento) => {
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const openSpecificModal = () => {
    if (currentPage === 'eventos') {
      setEditingEvent(null);
      setIsNewEventModalOpen(true);
    } else if (currentPage === 'orcamentos') {
      setEditingOrcamento(null);
      setIsNewOrcamentoModalOpen(true);
    } else {
      setEditingRemoval(null);
      setIsNewModalOpen(true);
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h2>
            <p className="text-slate-500 mt-2">Acesse o Gestor de Remoções Pro</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-200">
              Entrar no Sistema
            </button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => alert('Por favor, contate o administrador do sistema para redefinir sua senha.')}
                className="text-sm text-indigo-600 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="text-center text-xs text-slate-400 mt-2">Padrão: admin / admin</div>
          </form>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        onLogout={() => setIsLoggedIn(false)}
        username={currentUser?.name || 'Usuário'}
        userProfile={currentUser?.profile}
      />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {currentPage === 'kanban' ? 'Quadro de Gestão' : 
               currentPage === 'financeiro' ? 'Controle Financeiro' : 
               currentPage === 'remocoes' ? 'Lista de Atendimentos' :
               currentPage === 'eventos' ? 'Gestão de Eventos' :
               currentPage === 'orcamentos' ? 'Orçamentos e Propostas' :
               currentPage === 'calendario' ? 'Agenda de Remoções' :
               currentPage === 'convenios' ? 'Convênios e Preços' :
               currentPage === 'prestadores' ? 'Base de Prestadores' :
               currentPage === 'usuarios' ? 'Gestão de Usuários' :
               currentPage === 'relatorios' ? 'Relatórios Gerenciais' :
               'Visão Geral'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie suas operações com eficiência.</p>
          </div>
          {currentPage !== 'dashboard' && currentPage !== 'financeiro' && currentPage !== 'convenios' && currentPage !== 'prestadores' && currentPage !== 'usuarios' && currentPage !== 'relatorios' && (
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
              onClick={openSpecificModal}
            >
              + {currentPage === 'eventos' ? 'Novo Evento' : currentPage === 'orcamentos' ? 'Novo Orçamento' : 'Novo Registro'}
            </button>
          )}
        </header>

        {currentPage === 'dashboard' && <Dashboard remocoes={remocoes} />}
        
        {currentPage === 'kanban' && (
          <Kanban 
            remocoes={remocoes} 
            onStatusChange={updateStatus}
            onFaturar={faturarRemocao}
          />
        )}

        {currentPage === 'remocoes' && (
          <TransportList 
            remocoes={remocoes} 
            onView={handleViewRemoval}
            onEdit={handleEditRemoval}
          />
        )}

        {currentPage === 'eventos' && (
          <Eventos 
            eventos={eventos} 
            prestadores={prestadores} 
            onEdit={handleEditEvent}
            onOpenCompleteModal={handleOpenCompleteEventModal}
          />
        )}
        
        {currentPage === 'orcamentos' && (
          <Orcamentos 
            orcamentos={orcamentos} 
            onUpdateStatus={updateOrcamentoStatus} 
            onEdit={handleEditOrcamento}
          />
        )}

        {currentPage === 'calendario' && (
          <CalendarView remocoes={remocoes} />
        )}

        {currentPage === 'financeiro' && (
          <Financials 
            remocoes={remocoes} 
            lancamentos={lancamentos}
            convenios={convenios}
            onAddLancamento={handleAddLancamento}
            onUpdateStatus={updateFinanceStatus}
          />
        )}
        
        {currentPage === 'relatorios' && (
          <ReportGenerator remocoes={remocoes} convenios={convenios} />
        )}

        {currentPage === 'convenios' && (
          <Convenios convenios={convenios} onUpdate={setConvenios} />
        )}

        {currentPage === 'prestadores' && (
          <Prestadores prestadores={prestadores} onUpdate={setPrestadores} />
        )}

        {currentPage === 'usuarios' && (
          <UserManagement users={users} onUpdate={setUsers} />
        )}
      </main>

      <NewRemovalModal 
        isOpen={isNewModalOpen}
        onClose={() => { setIsNewModalOpen(false); setEditingRemoval(null); }}
        onSave={handleSaveNewRemoval}
        initialData={editingRemoval}
      />

      <NewEventModal 
        isOpen={isNewEventModalOpen}
        onClose={() => { setIsNewEventModalOpen(false); setEditingEvent(null); }}
        onSave={handleSaveNewEvent}
        availablePrestadores={prestadores}
        initialData={editingEvent}
      />

      <NewOrcamentoModal 
        isOpen={isNewOrcamentoModalOpen}
        onClose={() => { setIsNewOrcamentoModalOpen(false); setEditingOrcamento(null); }}
        onSave={handleSaveOrcamento}
        convenios={convenios}
        initialData={editingOrcamento}
      />
      
      <RemovalDetailsModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={viewingRemoval}
      />

      <CompleteEventModal 
        isOpen={isCompleteEventModalOpen}
        onClose={() => { setIsCompleteEventModalOpen(false); setCompletingEvent(null); }}
        onSave={handleCompleteEventSave}
        eventName={completingEvent?.nome || ''}
      />
    </div>
  );
}

export default App;
