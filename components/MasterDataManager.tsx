
import React, { useState } from 'react';
import { Company } from '../types';

interface MasterDataProps {
  type: 'companies' | 'suppliers' | 'categories';
  data: any[];
  onSave: (item: any) => void;
  onDelete: (id: number) => void;
}

const MasterDataManager: React.FC<MasterDataProps> = ({ type, data, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState<any>(null);

  const availableCurrencies = ['Bs', 'USD', 'EUR', 'COP'];
  const taxIdLabels = ['RIF', 'Cédula', 'ID Fiscal', 'VAT', 'Passport'];

  const toggleCurrency = (curr: string) => {
    const current = isEditing.currencies || [];
    const updated = current.includes(curr) 
      ? current.filter((c: string) => c !== curr)
      : [...current, curr];
    setIsEditing({ ...isEditing, currencies: updated });
  };

  const getTitle = () => {
    if (type === 'companies') return 'Gestión de Entidades';
    if (type === 'suppliers') return 'Base de Proveedores';
    return 'Tipos de Gasto';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{getTitle()}</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configuración Maestra del Sistema</p>
        </div>
        <button 
          onClick={() => setIsEditing({ 
            id: Date.now(), 
            currencies: ['Bs', 'USD'], 
            taxIdLabel: 'RIF',
            name: '',
            rif: '',
            address: ''
          })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-blue-100 transition transform active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs uppercase tracking-widest">Añadir Nuevo</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
            <tr>
              {type === 'companies' && <th className="px-6 py-5">Entidad Receptora</th>}
              {type === 'suppliers' && <th className="px-6 py-5">Proveedor / Emisor</th>}
              {type === 'categories' && <th className="px-6 py-5">Gasto / Código</th>}
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  {type === 'companies' ? (
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700 text-base tracking-tight">{item.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">{item.taxIdLabel || 'RIF'}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{item.rif}</span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {item.currencies?.map((c: string) => (
                          <span key={c} className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-200">{c}</span>
                        ))}
                      </div>
                    </div>
                  ) : type === 'suppliers' ? (
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700">{item.name}</span>
                      <span className="font-mono text-[10px] text-blue-400 font-bold mt-1 tracking-widest">{item.rif}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700">{item.name}</span>
                      <span className="font-mono text-[9px] text-slate-300 uppercase tracking-[0.2em] mt-1">{item.code || 'SYS-' + item.id}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button onClick={() => setIsEditing(item)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-slate-300 font-bold italic">No hay registros creados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-10 border-8 border-white">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">Editor de Registro</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Maestro de Datos Principal</p>
                </div>
                <button onClick={() => setIsEditing(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             
             <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSave(isEditing); setIsEditing(null); }}>
                { (type === 'companies' || type === 'suppliers') && (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de ID</label>
                          <select 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black transition outline-none"
                            value={isEditing.taxIdLabel || 'RIF'}
                            onChange={e => setIsEditing({...isEditing, taxIdLabel: e.target.value})}
                          >
                            {taxIdLabels.map(lbl => <option key={lbl} value={lbl}>{lbl}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor ID</label>
                          <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-mono font-black text-blue-600 transition outline-none" value={isEditing.rif || ''} onChange={e => setIsEditing({...isEditing, rif: e.target.value})} placeholder="Ej: J-1234567-8 o V-000000" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Razón Social / Nombre Comercial</label>
                        <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 transition outline-none" value={isEditing.name || ''} onChange={e => setIsEditing({...isEditing, name: e.target.value})} placeholder="Nombre Completo" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección Fiscal</label>
                        <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-bold text-slate-500 transition outline-none" value={isEditing.address || ''} onChange={e => setIsEditing({...isEditing, address: e.target.value})} placeholder="Calle, Edificio, Ciudad" />
                      </div>
                    </div>
                    
                    {type === 'companies' && (
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monedas Operativas</label>
                        <div className="flex flex-wrap gap-2">
                          {availableCurrencies.map(curr => (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => toggleCurrency(curr)}
                              className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${
                                (isEditing.currencies || []).includes(curr)
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100'
                                  : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'
                              }`}
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                { type === 'categories' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Rubro</label>
                      <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 transition outline-none" value={isEditing.name || ''} onChange={e => setIsEditing({...isEditing, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Contable</label>
                      <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-mono font-black text-slate-400 transition outline-none" value={isEditing.code || ''} onChange={e => setIsEditing({...isEditing, code: e.target.value})} placeholder="Ej: CAT-100" />
                    </div>
                  </div>
                )}
                <div className="pt-6">
                   <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-95 uppercase tracking-widest text-xs">Guardar Cambios</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDataManager;
