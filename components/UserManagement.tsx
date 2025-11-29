
import React, { useState } from 'react';
import { User, UserProfile } from '../types';
import { UserCog, Plus, Trash2, Shield } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUpdate: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    profile: 'Administrador' as UserProfile
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.username && formData.password) {
      const newUser: User = {
        id: Date.now(),
        ...formData
      };
      onUpdate([...users, newUser]);
      setFormData({ name: '', username: '', password: '', profile: 'Administrador' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      onUpdate(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-indigo-600" />
          Gestão de Usuários
        </h2>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h4 className="font-bold mb-4">Cadastro de Usuário</h4>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
                <input 
                  className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Usuário (Login)</label>
                <input 
                  className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Senha</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Perfil de Acesso</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.profile}
                  onChange={e => setFormData({...formData, profile: e.target.value as UserProfile})}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Cadastrador">Cadastrador</option>
                  <option value="Prestador">Prestador</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 px-4">Cancelar</button>
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Salvar Usuário</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-full ${u.profile === 'Administrador' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                <Shield className="w-6 h-6" />
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{u.profile}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{u.name}</h3>
            <p className="text-sm text-slate-500 mt-1">@{u.username}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
               <button 
                onClick={() => handleDelete(u.id)}
                className="text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors flex items-center gap-1"
                disabled={u.username === 'admin'} // Protect default admin
               >
                 <Trash2 className="w-4 h-4" /> Remover
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;