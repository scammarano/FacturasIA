
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceUploader from './components/InvoiceUploader';
import InvoiceValidator from './components/InvoiceValidator';
import InvoiceList from './components/InvoiceList';
import PromptManager from './components/PromptManager';
import MasterDataManager from './components/MasterDataManager';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import Integrations from './components/Integrations';
import { Invoice, Company, Supplier, ExpenseCategory, AIPrompt, AuditLog, ProcessingItem, User, UserRole, RolePermissions } from './types';
import { INITIAL_COMPANIES, EXPENSE_CATEGORIES, INITIAL_PROMPTS, INITIAL_USERS, INITIAL_ROLE_PERMISSIONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>(EXPENSE_CATEGORIES);
  const [prompts, setPrompts] = useState<AIPrompt[]>(INITIAL_PROMPTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(INITIAL_ROLE_PERMISSIONS);
  
  const [processingQueue, setProcessingQueue] = useState<ProcessingItem[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const permissions = rolePermissions[currentUser.role];

  useEffect(() => {
    const savedInvoices = localStorage.getItem('sm_invoices');
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

    const savedSuppliers = localStorage.getItem('sm_suppliers');
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

    const savedCompanies = localStorage.getItem('sm_companies');
    if (savedCompanies) setCompanies(JSON.parse(savedCompanies));

    const savedCats = localStorage.getItem('sm_categories');
    if (savedCats) setCategories(JSON.parse(savedCats));

    const savedUsers = localStorage.getItem('sm_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedLogs = localStorage.getItem('sm_audit_logs');
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

    const savedPermissions = localStorage.getItem('sm_role_permissions');
    if (savedPermissions) setRolePermissions(JSON.parse(savedPermissions));
  }, []);

  const saveAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      userId: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      ip: '127.0.0.1',
      timestamp: new Date().toLocaleString()
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('sm_audit_logs', JSON.stringify(updatedLogs));
  };

  const genericSave = (key: string, data: any, setter: (val: any) => void) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleUpdateRolePermissions = (role: UserRole, perms: RolePermissions) => {
    const updated = { ...rolePermissions, [role]: perms };
    genericSave('sm_role_permissions', updated, setRolePermissions);
    saveAuditLog('MODIFICAR_PERMISOS', `Se actualizaron las habilidades del rol ${role}`);
  };

  const handleSaveInvoice = (invoice: Partial<Invoice>) => {
    let updatedInvoices;
    if (editingInvoice) {
      updatedInvoices = invoices.map(inv => inv.id === editingInvoice.id ? { ...inv, ...invoice } : inv);
      saveAuditLog('EDITAR_FACTURA', `Factura #${invoice.invoiceNumber} modificada.`);
      setEditingInvoice(null);
    } else {
      const newInvoice: Invoice = {
        ...invoice,
        id: Math.random().toString(36).substr(2, 9),
        promptId: prompts.find(p => p.isActive)?.id || 1,
      } as Invoice;
      updatedInvoices = [newInvoice, ...invoices];
      saveAuditLog('CREAR_FACTURA', `Nueva factura #${newInvoice.invoiceNumber} aprobada.`);
    }

    genericSave('sm_invoices', updatedInvoices, setInvoices);
    
    if (processingQueue.length <= currentQueueIndex + 1) {
        setProcessingQueue([]);
        setCurrentQueueIndex(0);
        setActiveTab('invoices');
    } else {
        setCurrentQueueIndex(currentQueueIndex + 1);
    }
  };

  const renderContent = () => {
    if (!permissions.allowedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
        return <Dashboard invoices={invoices} categories={categories} companies={companies} />;
    }

    if (processingQueue.length > 0) {
      const currentItem = processingQueue[currentQueueIndex];
      return (
        <InvoiceValidator 
          key={`validator-${currentQueueIndex}`}
          data={currentItem.data} 
          imageUrl={currentItem.imageUrl}
          companies={companies}
          categories={categories}
          invoices={invoices}
          suppliers={suppliers}
          onSave={handleSaveInvoice}
          onCancel={() => { 
            if (processingQueue.length > currentQueueIndex + 1) {
                setCurrentQueueIndex(currentQueueIndex + 1);
            } else {
                setProcessingQueue([]);
                setEditingInvoice(null);
            }
          }}
          onAddNewCompany={(c) => {
             const updated = [...companies, c];
             genericSave('sm_companies', updated, setCompanies);
             saveAuditLog('REGISTRAR_EMPRESA', `Empresa ${c.name} creada desde validación.`);
          }}
          onAddNewSupplier={(s) => {
             const updated = [...suppliers, s];
             genericSave('sm_suppliers', updated, setSuppliers);
             saveAuditLog('REGISTRAR_PROVEEDOR', `Proveedor ${s.name} creado desde validación.`);
          }}
          queueInfo={{ current: currentQueueIndex + 1, total: processingQueue.length }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard invoices={invoices} categories={categories} companies={companies} />;
      case 'upload':
        return <InvoiceUploader activePrompt={prompts.find(p => p.isActive)!} onQueueReady={(q) => { setProcessingQueue(q); setCurrentQueueIndex(0); }} />;
      case 'invoices':
        return <InvoiceList 
          invoices={invoices} 
          companies={companies} 
          categories={categories} 
          currentUser={currentUser} 
          rolePermissions={rolePermissions}
          onDelete={(id) => genericSave('sm_invoices', invoices.filter(i => i.id !== id), setInvoices)} 
          onEdit={(inv) => { setEditingInvoice(inv); setProcessingQueue([{ data: inv, imageUrl: inv.image, mimeType: 'image/jpeg' }]); }} 
        />;
      case 'companies':
        return <MasterDataManager type="companies" data={companies} 
          onSave={(item) => genericSave('sm_companies', companies.some(c => c.id === item.id) ? companies.map(c => c.id === item.id ? item : c) : [...companies, item], setCompanies)}
          onDelete={(id) => genericSave('sm_companies', companies.filter(c => c.id !== id), setCompanies)} />;
      case 'suppliers':
        return <MasterDataManager type="suppliers" data={suppliers} 
          onSave={(item) => genericSave('sm_suppliers', suppliers.some(c => c.id === item.id) ? suppliers.map(c => c.id === item.id ? item : c) : [...suppliers, item], setSuppliers)}
          onDelete={(id) => genericSave('sm_suppliers', suppliers.filter(c => c.id !== id), setSuppliers)} />;
      case 'categories':
        return <MasterDataManager type="categories" data={categories} 
          onSave={(item) => genericSave('sm_categories', categories.some(c => c.id === item.id) ? categories.map(c => c.id === item.id ? item : c) : [...categories, item], setCategories)}
          onDelete={(id) => genericSave('sm_categories', categories.filter(c => c.id !== id), setCategories)} />;
      case 'users':
        return <UserManagement users={users} 
          onSave={(item) => genericSave('sm_users', users.some(u => u.id === item.id) ? users.map(u => u.id === item.id ? item : u) : [...users, item], setUsers)}
          onDelete={(id) => genericSave('sm_users', users.filter(u => u.id !== id), setUsers)} />;
      case 'roles':
        return <RoleManagement rolePermissions={rolePermissions} onUpdatePermissions={handleUpdateRolePermissions} />;
      case 'prompts':
        return <PromptManager prompts={prompts} onUpdate={(id, content) => genericSave('sm_prompts', prompts.map(p => p.id === id ? { ...p, content } : p), setPrompts)} />;
      case 'integrations':
        return <Integrations />;
      case 'audit':
        return (
          <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
             <div className="p-10 bg-slate-50 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Registro de Seguridad</h2>
             </div>
             <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-100">
                    <tr><th className="px-6 py-5 text-center">Fecha</th><th className="px-6 py-5">Actor</th><th className="px-6 py-5">Acción</th><th className="px-6 py-5">Descripción</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-300 text-center">{log.timestamp}</td>
                        <td className="px-6 py-4"><span className="font-black text-slate-700 text-xs">{log.userId}</span></td>
                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">{log.action}</span></td>
                        <td className="px-6 py-4 text-slate-400 text-xs font-bold">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        );
      default: return <Dashboard invoices={invoices} categories={categories} companies={companies} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} currentUser={currentUser} onSwitchUser={setCurrentUser} users={users} rolePermissions={rolePermissions} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-20 bg-white/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-8 z-10 border-b border-slate-200">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-100 rounded-2xl transition text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h7" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">{activeTab}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar"><div className="max-w-[1400px] mx-auto h-full">{renderContent()}</div></main>
      </div>
    </div>
  );
};

export default App;
