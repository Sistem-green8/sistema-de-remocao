
import React from 'react';
import { 
  LayoutDashboard, 
  Ambulance, 
  KanbanSquare, 
  Banknote, 
  FileText, 
  LogOut,
  UserCircle,
  CalendarDays,
  Briefcase,
  Users,
  Tent,
  UserCog,
  FileSignature
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  onLogout: () => void;
  username: string;
  userProfile?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, onLogout, username, userProfile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'remocoes', label: 'Atendimentos', icon: Ambulance },
    { id: 'orcamentos', label: 'Orçamentos', icon: FileSignature },
    { id: 'eventos', label: 'Eventos', icon: Tent },
    { id: 'kanban', label: 'Kanban', icon: KanbanSquare },
    { id: 'calendario', label: 'Calendário', icon: CalendarDays },
    { id: 'financeiro', label: 'Financeiro', icon: Banknote },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'convenios', label: 'Convênios', icon: Briefcase },
    { id: 'prestadores', label: 'Prestadores', icon: Users },
    { id: 'usuarios', label: 'Usuários', icon: UserCog },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Ambulance className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Gestor Pro</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-white">{username}</p>
            <p className="text-xs text-slate-500">{userProfile || 'Usuário'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
