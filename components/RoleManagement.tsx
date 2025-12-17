
import React from 'react';
import { UserRole, RolePermissions } from '../types';

interface RoleManagementProps {
  rolePermissions: Record<UserRole, RolePermissions>;
  onUpdatePermissions: (role: UserRole, permissions: RolePermissions) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ rolePermissions, onUpdatePermissions }) => {
  const roles: UserRole[] = ['Admin', 'Editor', 'Loader'];
  
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'upload', label: 'Carga Vision IA' },
    { id: 'invoices', label: 'Libro de Egresos' },
    { id: 'companies', label: 'Empresas' },
    { id: 'suppliers', label: 'Proveedores' },
    { id: 'categories', label: 'Tipos de Gasto' },
    { id: 'prompts', label: 'Motor IA' },
    { id: 'users', label: 'Usuarios' },
    { id: 'roles', label: 'Gestión de Habilidades' },
    { id: 'audit', label: 'Auditoría' }
  ];

  const handleToggleTab = (role: UserRole, tabId: string) => {
    const current = rolePermissions[role];
    const newTabs = current.allowedTabs.includes(tabId)
      ? current.allowedTabs.filter(t => t !== tabId)
      : [...current.allowedTabs, tabId];
    
    onUpdatePermissions(role, { ...current, allowedTabs: newTabs });
  };

  const handleToggleAction = (role: UserRole, action: keyof Omit<RolePermissions, 'allowedTabs'>) => {
    const current = rolePermissions[role];
    onUpdatePermissions(role, { ...current, [action]: !current[action] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Matriz de Habilidades</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configura qué puede hacer cada perfil en el sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roles.map((role) => (
          <div key={role} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className={`p-8 text-white ${role === 'Admin' ? 'bg-blue-600' : role === 'Editor' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              <h3 className="text-2xl font-black tracking-tighter">{role}</h3>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest mt-1">Configuración de Acceso</p>
            </div>
            
            <div className="p-8 flex-1 space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Módulos Visibles</label>
                <div className="grid grid-cols-1 gap-2">
                  {allTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleToggleTab(role, tab.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        rolePermissions[role].allowedTabs.includes(tab.id)
                          ? 'border-blue-100 bg-blue-50/50 text-blue-700'
                          : 'border-slate-50 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="text-xs font-black">{tab.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 ${rolePermissions[role].allowedTabs.includes(tab.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Acciones Especiales</label>
                <div className="space-y-3">
                  {[
                    { id: 'canEditInvoices', label: 'Editar Facturas' },
                    { id: 'canDeleteInvoices', label: 'Eliminar Facturas' },
                    { id: 'canManageMasters', label: 'Gestionar Maestros' },
                    { id: 'canManageSystem', label: 'Administrar Sistema' }
                  ].map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleToggleAction(role, action.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        (rolePermissions[role] as any)[action.id]
                          ? 'bg-slate-800 text-white shadow-lg'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${ (rolePermissions[role] as any)[action.id] ? 'bg-blue-500' : 'bg-slate-300' }`}>
                         <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${ (rolePermissions[role] as any)[action.id] ? 'right-1' : 'left-1' }`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fix: Adding default export
export default RoleManagement;
