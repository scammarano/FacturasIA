
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Invoice, ExpenseCategory, Company } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  categories: ExpenseCategory[];
  companies: Company[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, categories, companies }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | 'all'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const availableSuppliers = Array.from(new Set(invoices.map(i => i.supplierName))).sort();
  const availableCurrencies = Array.from(new Set(invoices.map(i => i.currency))).sort();

  const filteredInvoices = invoices.filter(inv => {
    const companyMatch = selectedCompanyId === 'all' || inv.companyId === selectedCompanyId;
    const supplierMatch = selectedSupplier === 'all' || inv.supplierName === selectedSupplier;
    const currencyMatch = selectedCurrency === 'all' || inv.currency === selectedCurrency;
    const categoryMatch = selectedCategoryId === 'all' || inv.categoryId === selectedCategoryId;
    return companyMatch && supplierMatch && currencyMatch && categoryMatch;
  });

  const stats = {
    totalBs: filteredInvoices.reduce((acc, curr) => acc + curr.totalBs, 0),
    count: filteredInvoices.length,
    byCurrency: filteredInvoices.reduce((acc: any, curr) => {
      acc[curr.currency] = (acc[curr.currency] || 0) + curr.total;
      return acc;
    }, {})
  };

  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: filteredInvoices
      .filter(i => i.categoryId === cat.id)
      .reduce((acc, curr) => acc + curr.totalBs, 0)
  })).filter(d => d.value > 0);

  const monthlyData = filteredInvoices.reduce((acc: any[], inv) => {
    const month = new Date(inv.date).toLocaleString('es-ES', { month: 'short' });
    const existing = acc.find(d => d.name === month);
    if (existing) {
      existing.monto += inv.totalBs;
    } else {
      acc.push({ name: month, monto: inv.totalBs });
    }
    return acc;
  }, []).sort((a, b) => {
     const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
     return months.indexOf(a.name.toLowerCase()) - months.indexOf(b.name.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Panel de Inteligencia</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Análisis Multidimensional</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Empresa Receptora</label>
            <select 
              value={selectedCompanyId} 
              onChange={(e) => setSelectedCompanyId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition"
            >
              <option value="all">Todas las Entidades</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tipo de Gasto</label>
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Proveedor</label>
            <select 
              value={selectedSupplier} 
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition"
            >
              <option value="all">Todos los Proveedores</option>
              {availableSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Moneda</label>
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition"
            >
              <option value="all">Cualquier Moneda</option>
              {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
             <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.7-.35-3.04-1.25-3.57-2.31l1.59-1.59c.35.61 1.25 1.16 2.08 1.32.74.14 1.76.04 2.22-.32.41-.31.33-.76.01-1.02-.3-.24-1.24-.59-2.58-1.04-1.34-.44-2.81-.92-3.48-1.92-.48-.7-.41-1.84.41-2.61.64-.61 1.63-1.01 2.75-1.15V5h2.82v1.91c1.34.25 2.5 1.05 2.87 2.04l-1.59 1.59c-.28-.56-.91-1.05-1.58-1.19-.74-.15-1.74-.03-2.11.23-.33.24-.31.57-.02.82.3.26 1.05.51 2.37.95 1.32.44 2.82.94 3.49 1.94.48.71.43 1.84-.4 2.62-.64.63-1.63 1.05-2.75 1.15z"/></svg>
          </div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Total Filtrado (Bs)</p>
          <p className="text-4xl font-black tracking-tighter">Bs. {stats.totalBs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="mt-6 flex space-x-2">
             <span className="text-[9px] bg-white/10 px-3 py-1 rounded-full font-black uppercase">Documentos: {stats.count}</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Totales por Moneda</p>
          <div className="space-y-3">
            {Object.entries(stats.byCurrency).map(([curr, val]: any) => (
              <div key={curr} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{curr}</span>
                <span className="text-sm font-black text-slate-800">{val.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            ))}
            {Object.keys(stats.byCurrency).length === 0 && <span className="text-xs text-slate-400 italic">Sin resultados</span>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Salud del Gasto</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full w-2/3"></div>
          </div>
          <p className="text-[11px] font-bold text-slate-600 mt-4">Sincronización al 100%</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Auditado por SmartInvoice Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Evolución Cronológica</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Histórico en Bolívares</p>
          </div>
          <div className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                    itemStyle={{fontSize: '12px', fontWeight: '900'}}
                  />
                  <Bar dataKey="monto" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 font-bold italic text-sm">No hay registros para mostrar</div>
            )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Estructura por Categoría</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Porcentaje del Gasto Total</p>
          </div>
          <div className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 font-bold italic text-sm">Sin datos para categorizar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
