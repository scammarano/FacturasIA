
export type UserRole = 'Admin' | 'Editor' | 'Loader';

export interface RolePermissions {
  allowedTabs: string[];
  canEditInvoices: boolean;
  canDeleteInvoices: boolean;
  canManageMasters: boolean;
  canManageSystem: boolean;
}

export interface Role {
  id: number;
  name: UserRole;
  permissions: RolePermissions;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Company {
  id: number;
  rif: string;
  name: string;
  address: string;
  currencies: string[];
  taxIdLabel: string;
}

export interface Supplier {
  id: number;
  rif: string;
  name: string;
  address: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  code?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  companyId: number;
  supplierId: string;
  supplierName: string;
  supplierRif: string;
  invoiceNumber: string;
  controlSerial: string;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  exchangeRate: number;
  totalBs: number;
  totalForeign: number;
  status: 'pendiente' | 'validada';
  promptId: number;
  image: string;
  items: InvoiceItem[];
  categoryId: number;
}

export interface AIPrompt {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
}

export interface AuditLog {
  id: number;
  userId: string;
  userRole: string;
  action: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface ProcessingItem {
  data: any;
  imageUrl: string;
  mimeType: string;
}
