
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onSave: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState<User | null>(null);

  const roles: UserRole[] = ['Admin', 'Editor', 'Loader'];

  const handleAddNew = () => {
    setIsEditing({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      role: 'Loader',
      avatar: `https://ui-avatars.com/api/?background=random&color=fff&name=User`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Control de Accesos</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de Usuarios y Roles</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-blue-100 transition transform active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          <span className="text-xs uppercase tracking-widest">Crear Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">Usuario</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Rol</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl" alt="" />
                    <span className="font-black text-slate-700 text-base">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-slate-400">{user.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.role === 'Admin' ? 'bg-blue-50 text-blue-600' :
                    user.role === 'Editor' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button onClick={() => setIsEditing(user)} className="p-2.5 text-slate-300 hover:text-blue-600 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => onDelete(user.id)} className="p-2.5 text-slate-300 hover:text-red-600 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 border-8 border-white">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Ficha de Usuario</h3>
                <button onClick={() => setIsEditing(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             
             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(isEditing); setIsEditing(null); }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                  <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 outline-none transition" value={isEditing.name} onChange={e => setIsEditing({...isEditing, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                  <input type="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 outline-none transition" value={isEditing.email} onChange={e => setIsEditing({...isEditing, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol del Sistema</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 outline-none transition"
                    value={isEditing.role}
                    onChange={e => setIsEditing({...isEditing, role: e.target.value as UserRole})}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="pt-6">
                   <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-blue-700 transition uppercase tracking-widest text-xs">Confirmar Usuario</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
