
import { Company, ExpenseCategory, AIPrompt, User, UserRole, RolePermissions } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Administrador Sistema', email: 'admin@smartinvoice.ai', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' },
  { id: 'u2', name: 'Gerente Contable', email: 'gerente@smartinvoice.ai', role: 'Editor', avatar: 'https://ui-avatars.com/api/?name=Editor+User&background=6366f1&color=fff' },
  { id: 'u3', name: 'Operador Carga', email: 'carga@smartinvoice.ai', role: 'Loader', avatar: 'https://ui-avatars.com/api/?name=Loader+User&background=10b981&color=fff' }
];

export const INITIAL_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: {
    allowedTabs: ['dashboard', 'upload', 'invoices', 'companies', 'suppliers', 'categories', 'prompts', 'users', 'roles', 'audit'],
    canEditInvoices: true,
    canDeleteInvoices: true,
    canManageMasters: true,
    canManageSystem: true
  },
  Editor: {
    allowedTabs: ['dashboard', 'upload', 'invoices', 'companies', 'suppliers', 'categories'],
    canEditInvoices: true,
    canDeleteInvoices: false,
    canManageMasters: true,
    canManageSystem: false
  },
  Loader: {
    allowedTabs: ['dashboard', 'upload', 'invoices'],
    canEditInvoices: false,
    canDeleteInvoices: false,
    canManageMasters: false,
    canManageSystem: false
  }
};

export const INITIAL_COMPANIES: Company[] = [
  { 
    id: 1, 
    rif: 'J-12345678-9', 
    name: 'Distribuidora Global C.A.', 
    address: 'Av. Libertador, Caracas',
    currencies: ['Bs', 'USD'],
    taxIdLabel: 'RIF'
  }
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 1, name: 'Operativo' },
  { id: 2, name: 'Impuestos' },
  { id: 3, name: 'Nómina' },
  { id: 4, name: 'Mantenimiento' },
  { id: 5, name: 'Suministros' }
];

export const INITIAL_PROMPTS: AIPrompt[] = [
  {
    id: 1,
    title: 'Extracción Fiscal Estricta',
    content: `Analiza el documento y devuelve EXCLUSIVAMENTE un JSON con esta estructura:
{
  "client": { "name": "Nombre de mi empresa receptora", "rif": "RIF del receptor" },
  "supplier": { "name": "Nombre del proveedor/emisor", "rif": "RIF del emisor" },
  "invoiceNumber": "Número de factura",
  "controlSerial": "Número de control",
  "date": "YYYY-MM-DD",
  "currency": "Bs o USD",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "exchangeRate": 60.0,
  "items": [{"description": "item", "quantity": 1, "unitPrice": 0, "total": 0}]
}
Si no encuentras un dato, pon null. No inventes datos.`,
    isActive: true
  }
];
