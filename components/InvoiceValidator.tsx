
import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, Company, ExpenseCategory, Supplier } from '../types';

interface InvoiceValidatorProps {
  data: any;
  imageUrl: string;
  companies: Company[];
  categories: ExpenseCategory[];
  invoices: Invoice[];
  suppliers: Supplier[];
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
  onAddNewCompany: (company: Company) => void;
  onAddNewSupplier: (supplier: Supplier) => void;
  queueInfo?: { current: number; total: number };
}

const InvoiceValidator: React.FC<InvoiceValidatorProps> = ({ 
  data, imageUrl, companies, categories, invoices, suppliers, onSave, onCancel, onAddNewCompany, onAddNewSupplier, queueInfo 
}) => {
  const isPdf = imageUrl.includes('application/pdf');
  
  // Normalizar datos de entrada (IA vs Factura Existente)
  const initialData = useMemo(() => {
    return {
      supplierName: data.supplierName || data.supplier?.name || '',
      supplierRif: data.supplierRif || data.supplier?.rif || '',
      invoiceNumber: data.invoiceNumber || '',
      controlSerial: data.controlSerial || '',
      date: data.date || '',
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      currency: data.currency || 'Bs',
      exchangeRate: data.exchangeRate || 60.00,
      companyId: data.companyId || companies.find(c => c.rif === data.client?.rif)?.id || companies[0]?.id || 0,
      categoryId: data.categoryId || categories[0]?.id || 1,
    };
  }, [data, companies, categories]);

  const [formData, setFormData] = useState(initialData);

  // Detección reactiva de Empresa Receptora nueva (solo si viene de IA)
  const isNewCompany = useMemo(() => {
    if (!data.client?.rif) return false;
    return !companies.some(c => c.rif === data.client.rif);
  }, [companies, data.client]);

  // Detección reactiva de Proveedor nuevo
  const isNewSupplier = useMemo(() => {
    if (!formData.supplierRif) return false;
    return !suppliers.some(s => s.rif === formData.supplierRif);
  }, [suppliers, formData.supplierRif]);

  // Chequeo de duplicados (excluyendo la factura actual si estamos editando)
  const isDuplicate = invoices.some(inv => 
    inv.id !== data.id &&
    inv.supplierRif === formData.supplierRif && 
    inv.invoiceNumber === formData.invoiceNumber
  );

  const totalBs = formData.currency === 'Bs' ? formData.total : formData.total * formData.exchangeRate;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'subtotal' || name === 'tax' || name === 'total' || name === 'exchangeRate' || name === 'companyId' || name === 'categoryId') 
        ? (name === 'companyId' || name === 'categoryId' ? parseInt(value) : parseFloat(value) || 0) 
        : value 
    }));
  };

  const handleRegisterNewCompany = () => {
    if (!data.client) return;
    const newComp: Company = {
      id: Date.now(),
      rif: data.client.rif,
      name: data.client.name,
      address: 'Dirección detectada por IA',
      currencies: ['Bs', 'USD'],
      taxIdLabel: 'RIF'
    };
    onAddNewCompany(newComp);
    setFormData(prev => ({ ...prev, companyId: newComp.id }));
  };

  const handleRegisterNewSupplier = () => {
    if (!formData.supplierRif) return;
    const newSupp: Supplier = {
      id: Date.now(),
      rif: formData.supplierRif,
      name: formData.supplierName,
      address: 'Registrado desde validación'
    };
    onAddNewSupplier(newSupp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-registrar proveedor si es nuevo al momento de aprobar
    if (isNewSupplier) {
      handleRegisterNewSupplier();
    }

    onSave({
      ...formData,
      totalBs,
      totalForeign: formData.currency === 'Bs' ? 0 : formData.total,
      image: imageUrl,
      status: 'validada'
    } as any);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden h-[calc(100vh-10rem)] flex flex-col md:flex-row border-4 border-white animate-in fade-in zoom-in duration-300">
      {/* Vista Previa */}
      <div className="w-full md:w-1/2 bg-[#0f172a] flex items-center justify-center p-6 relative">
        {isPdf ? (
          <div className="w-full h-full rounded-3xl bg-white overflow-hidden shadow-2xl">
             <object data={imageUrl} type="application/pdf" className="w-full h-full">
               <p className="p-10 text-center text-slate-400 font-bold">PDF no disponible.</p>
             </object>
          </div>
        ) : (
          <img src={imageUrl} className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" alt="Documento" />
        )}
        
        {queueInfo && (
          <div className="absolute top-8 left-8 bg-blue-600/90 backdrop-blur text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2">
             <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
             <span>{data.id ? 'Editando Factura' : `Procesando ${queueInfo.current} de ${queueInfo.total}`}</span>
          </div>
        )}
      </div>

      {/* Formulario de Auditoría */}
      <div className="w-full md:w-1/2 p-10 overflow-y-auto bg-slate-50/50 custom-scrollbar">
        {isDuplicate && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-2xl flex items-center space-x-3 animate-pulse">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <span className="text-xs font-black uppercase tracking-widest">¡Advertencia! Posible Factura Duplicada</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-8">
          <div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{data.id ? 'Revisar Datos' : 'Auditoría Fiscal'}</h2>
             <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">Verificación Humana Requerida</p>
          </div>
          <div className="flex space-x-2">
             <button onClick={onCancel} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition">Cancelar</button>
             <button onClick={handleSubmit} className="px-7 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-blue-100 hover:bg-blue-700 transition">Aprobar y Guardar</button>
          </div>
        </div>

        {isNewCompany && data.client && (
          <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-center justify-between shadow-sm border-dashed">
            <div>
               <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">IA: Nuevo Receptor Detectado</p>
               <p className="text-base font-black text-slate-800">{data.client.name}</p>
               <p className="text-[10px] font-mono font-bold text-amber-600">{data.client.rif}</p>
            </div>
            <button onClick={handleRegisterNewCompany} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-amber-200">Crear Empresa</button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa Receptora</label>
              <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500">
                <option value={0}>Seleccione Empresa...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Gasto</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datos del Emisor (Proveedor)</h3>
               {isNewSupplier && (
                 <span className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-full border border-blue-100 animate-pulse">Nuevo Proveedor</span>
               )}
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Razón Social</label>
                  <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 font-black text-slate-700" />
               </div>
               <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">RIF Emisor</label>
                  <input type="text" name="supplierRif" value={formData.supplierRif} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 font-mono font-bold text-blue-600" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Moneda</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-black">
                <option value="Bs">Bs</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Tasa Cambio</label>
              <input type="number" step="0.01" name="exchangeRate" value={formData.exchangeRate} onChange={handleChange} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-black text-blue-600" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Número Factura</label>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-black" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Serial Control</label>
              <input type="text" name="controlSerial" value={formData.controlSerial} onChange={handleChange} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-black" />
            </div>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-[2rem] text-white">
             <div className="grid grid-cols-2 gap-8 items-center">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Monto Total ({formData.currency})</p>
                   <input type="number" step="0.01" name="total" value={formData.total} onChange={handleChange} className="bg-transparent border-b-2 border-blue-500/30 focus:border-blue-500 w-full text-3xl font-black outline-none transition" />
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                   <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Equivalente en Bolívares</p>
                   <p className="text-xl font-black">Bs. {totalBs.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Documento</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-black text-slate-700 outline-none" />
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceValidator;
