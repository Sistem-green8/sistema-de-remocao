
import React, { useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { UserCog, Plus, Trash2, Shield, Edit } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUpdate: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdate }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const initialFormState = {
    name: '',
    username: '',
    password: '',
    profile: 'Administrador' as UserProfile
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        username: editingUser.username,
        password: '', // Clear password for security
        profile: editingUser.profile
      });
      setIsFormVisible(true);
    } else {
      setFormData(initialFormState);
    }
  }, [editingUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) {
      alert("Nome e Usuário (Login) são obrigatórios.");
      return;
    }

    if (editingUser) {
      // Update existing user
      if (!formData.password && !editingUser.password) {
        alert("Senha é obrigatória para novos usuários sem senha prévia.");
        return;
      }
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: formData.name,
              username: formData.username,
              profile: formData.profile,
              // Only update password if a new one is provided
              password: formData.password ? formData.password : u.password 
            }
          : u
      );
      onUpdate(updatedUsers);
    } else {
      // Create new user
       if (!formData.password) {
        alert("Senha é obrigatória para novos usuários.");
        return;
      }
      const newUser: User = {
        id: Date.now(),
        ...formData
      };
      onUpdate([...users, newUser]);
    }

    handleCancel();
  };
  
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingUser(null);
    setFormData(initialFormState);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      onUpdate(users.filter(u => u.id !== id));
    }
  };
  
  const handleAddNewClick = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setIsFormVisible(true);
  };
  
  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-indigo-600" />
          Gestão de Usuários
        </h2>
        <button onClick={handleAddNewClick} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h4 className="font-bold mb-4">{editingUser ? `Editando "${editingUser.name}"` : 'Cadastro de Usuário'}</h4>
          <form onSubmit={handleSave}>
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
                  required={!editingUser} // Required only when creating
                  placeholder={editingUser ? "Deixe em branco para não alterar" : ""}
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
              <button type="button" onClick={handleCancel} className="text-slate-500 px-4">Cancelar</button>
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
                {editingUser ? 'Atualizar Usuário' : 'Salvar Usuário'}
              </button>
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
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
               <button 
                onClick={() => handleEditClick(u)}
                className="text-slate-500 text-sm font-medium hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors flex items-center gap-1"
               >
                 <Edit className="w-4 h-4" /> Editar
               </button>
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
