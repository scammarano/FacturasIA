
import React from 'react';
import { User, UserRole, RolePermissions } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  users: User[];
  rolePermissions: Record<UserRole, RolePermissions>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, currentUser, onSwitchUser, users, rolePermissions }) => {
  const permissions = rolePermissions[currentUser.role];

  const menuGroups = [
    {
      label: 'PRINCIPAL',
      items: [
        { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
        { id: 'upload', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', label: 'Carga Vision IA' },
        { id: 'invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Libro de Egresos' },
      ]
    },
    {
      label: 'GESTIÓN MAESTRA',
      items: [
        { id: 'companies', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Mis Empresas' },
        { id: 'suppliers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Proveedores' },
        { id: 'categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: 'Tipos de Gasto' },
      ]
    },
    {
      label: 'SISTEMA',
      items: [
        { id: 'prompts', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Motor IA' },
        { id: 'integrations', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Conectividad ERP' },
        { id: 'users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', label: 'Usuarios' },
        { id: 'roles', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', label: 'Habilidades' },
        { id: 'audit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Seguridad' },
      ]
    }
  ];

  return (
    <div className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-[#1a1c1e] h-full flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out`}>
      <div className="p-8 border-b border-white/5 flex items-center space-x-3 bg-[#111214] shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/20">SI</div>
        <div className="flex flex-col">
          <span className="text-white text-lg font-black tracking-tighter leading-none">SmartInvoice</span>
          <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Enterprise IA</span>
        </div>
      </div>
      
      <div className="flex-1 mt-6 overflow-y-auto custom-scrollbar px-4 space-y-8">
        {menuGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter(i => permissions.allowedTabs.includes(i.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx}>
              <p className="px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">{group.label}</p>
              <nav className="space-y-1">
                {visibleItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20 translate-x-1' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <svg className={`mr-3 h-5 w-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                    </svg>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5 bg-[#111214] shrink-0">
        <div className="mb-4">
           <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Simulador de Acceso</label>
           <select 
             className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white font-bold outline-none focus:border-blue-500 transition"
             value={currentUser.id}
             onChange={(e) => onSwitchUser(users.find(u => u.id === e.target.value)!)}
           >
              {users.map(u => <option key={u.id} value={u.id} className="bg-gray-900">{u.name} ({u.role})</option>)}
           </select>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl border-2 border-white/10" alt="avatar" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-black text-white truncate leading-none mb-1">{currentUser.name}</span>
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Adding default export
export default Sidebar;
