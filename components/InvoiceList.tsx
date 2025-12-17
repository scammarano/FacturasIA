
import React, { useState, useMemo } from 'react';
import { Invoice, Company, ExpenseCategory, User, RolePermissions } from '../types';
import { INITIAL_ROLE_PERMISSIONS } from '../constants';

interface InvoiceListProps {
  invoices: Invoice[];
  companies: Company[];
  categories: ExpenseCategory[];
  currentUser: User;
  onDelete: (id: string) => void;
  onEdit: (invoice: Invoice) => void;
  rolePermissions?: Record<string, RolePermissions>;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, companies, categories, currentUser, onDelete, onEdit, rolePermissions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<number | 'all'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice | string; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });

  const permissions = rolePermissions ? rolePermissions[currentUser.role] : INITIAL_ROLE_PERMISSIONS[currentUser.role];

  const availableSuppliers = useMemo(() => Array.from(new Set(invoices.map(i => i.supplierName))).sort(), [invoices]);
  const availableCurrencies = useMemo(() => Array.from(new Set(invoices.map(i => i.currency))).sort(), [invoices]);

  const handleSort = (key: keyof Invoice | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const searchMatch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.supplierRif.toLowerCase().includes(searchTerm.toLowerCase());
      
      const companyMatch = selectedCompany === 'all' || inv.companyId === selectedCompany;
      const supplierMatch = selectedSupplier === 'all' || inv.supplierName === selectedSupplier;
      const categoryMatch = selectedCategory === 'all' || inv.categoryId === selectedCategory;
      const currencyMatch = selectedCurrency === 'all' || inv.currency === selectedCurrency;
      
      const dateVal = new Date(inv.date);
      const startMatch = !startDate || dateVal >= new Date(startDate);
      const endMatch = !endDate || dateVal <= new Date(endDate);

      return searchMatch && companyMatch && supplierMatch && categoryMatch && currencyMatch && startMatch && endMatch;
    });
  }, [invoices, searchTerm, selectedCompany, selectedSupplier, selectedCategory, selectedCurrency, startDate, endDate]);

  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
    if (sortConfig) {
      sorted.sort((a, b) => {
        const { key, direction } = sortConfig;
        let aVal: any = (a as any)[key];
        let bVal: any = (b as any)[key];

        // Manejar casos especiales como IDs que representan nombres
        if (key === 'companyId') {
          aVal = companies.find(c => c.id === a.companyId)?.name || '';
          bVal = companies.find(c => c.id === b.companyId)?.name || '';
        } else if (key === 'categoryId') {
          aVal = categories.find(c => c.id === a.categoryId)?.name || '';
          bVal = categories.find(c => c.id === b.categoryId)?.name || '';
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredInvoices, sortConfig, companies, categories]);

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return (
      <svg className="w-3 h-3 ml-1 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>
    );
    return sortConfig.direction === 'asc' ? (
      <svg className="w-3 h-3 ml-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
    ) : (
      <svg className="w-3 h-3 ml-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Libro de Egresos</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Auditado por {currentUser.name}</p>
          </div>
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Buscar por nro, RIF o proveedor..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none text-xs font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-300 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Compañía</label>
            <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500">
              <option value="all">Todas</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Proveedor</label>
            <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500">
              <option value="all">Todos</option>
              {availableSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500">
              <option value="all">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Moneda</label>
            <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500">
              <option value="all">Todas</option>
              {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Desde</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Hasta</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th onClick={() => handleSort('date')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
                  <div className="flex items-center">Fecha {getSortIcon('date')}</div>
                </th>
                <th onClick={() => handleSort('companyId')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition">
                  <div className="flex items-center">Empresa {getSortIcon('companyId')}</div>
                </th>
                <th onClick={() => handleSort('supplierName')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition">
                  <div className="flex items-center">Proveedor {getSortIcon('supplierName')}</div>
                </th>
                <th onClick={() => handleSort('invoiceNumber')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition">
                  <div className="flex items-center">Factura {getSortIcon('invoiceNumber')}</div>
                </th>
                <th onClick={() => handleSort('categoryId')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition">
                  <div className="flex items-center">Categoría {getSortIcon('categoryId')}</div>
                </th>
                <th onClick={() => handleSort('totalBs')} className="px-6 py-5 text-right cursor-pointer hover:bg-slate-100 transition">
                  <div className="flex items-center justify-end">Total Bs. {getSortIcon('totalBs')}</div>
                </th>
                <th className="px-6 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-500 font-black text-[10px] whitespace-nowrap">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-600 block truncate max-w-[120px]">
                      {companies.find(c => c.id === inv.companyId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-blue-600 text-[10px]">{inv.supplierName}</span>
                      <span className="text-[8px] font-mono text-slate-400">{inv.supplierRif}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-700 text-[10px]">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                      {categories.find(c => c.id === inv.categoryId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-black text-slate-800 text-[11px]">Bs. {inv.totalBs.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      {inv.currency !== 'Bs' && (
                         <span className="text-[8px] text-slate-400 font-bold">{inv.currency} {inv.total.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedImage(inv.image)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl" title="Ver Soporte"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                      
                      {permissions.canEditInvoices && (
                        <button onClick={() => onEdit(inv)} className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl" title="Editar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                      )}
                      
                      {permissions.canDeleteInvoices && (
                        <button onClick={() => { if(confirm('¿Seguro de eliminar esta factura?')) onDelete(inv.id)}} className="p-2 hover:bg-red-50 text-red-600 rounded-xl" title="Eliminar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sortedInvoices.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">No se encontraron registros bajo estos filtros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[3rem] shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden border-8 border-white">
            <div className="flex justify-between items-center p-8 border-b border-slate-50">
               <div><h3 className="font-black text-slate-800 text-2xl tracking-tighter">Visor de Soporte</h3></div>
               <button onClick={() => setSelectedImage(null)} className="p-4 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center custom-scrollbar">
               {selectedImage.startsWith('data:application/pdf') ? (
                 <object data={selectedImage} type="application/pdf" className="w-full h-full rounded-xl">
                   <p className="p-10 text-center font-bold">Previsualización no disponible.</p>
                 </object>
               ) : (
                 <img src={selectedImage} className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border-4 border-white" alt="Factura" />
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
