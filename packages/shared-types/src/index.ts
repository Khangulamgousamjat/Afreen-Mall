export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  STORE_MANAGER = 'STORE_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  CASHIER = 'CASHIER',
  CASH_OFFICER = 'CASH_OFFICER',
  INVENTORY_STAFF = 'INVENTORY_STAFF',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
  PURCHASE_TEAM = 'PURCHASE_TEAM',
  AUDITOR = 'AUDITOR',
}

export enum SaleType {
  RETAIL = 'Retail Sale',
  WHOLESALE = 'Wholesale',
  INSTITUTIONAL = 'Institutional',
}

export enum PaymentMode {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  SPLIT = 'SPLIT',
}

export enum CashVarianceStatus {
  MATCHED = 'MATCHED',
  SHORT = 'SHORT',
  EXCESS = 'EXCESS',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
}

export interface UserSession {
  id: string;
  staffId: number;
  username: string;
  fullName: string;
  role: RoleName;
  mustChangePassword: boolean;
}

export interface DenominationBreakdown {
  d2000: number;
  d500: number;
  d200: number;
  d100: number;
  d50: number;
  d20: number;
  d10: number;
  d5: number;
  d2: number;
  d1: number;
}

export interface POSCartItem {
  id: string;
  barcode: string;
  name: string;
  description: string;
  qty: number;
  mrp: number; // in paise
  rate: number; // in paise
  discountPercent: number;
  discountAmount: number; // in paise
  gstPercent: number;
  netRate: number; // in paise
  value: number; // in paise
  unit: string;
  hsnCode: string;
}

export interface POSInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  saleType: SaleType;
  cashierName: string;
  cashierStaffId: number;
  paymentMode: PaymentMode;
  items: POSCartItem[];
  totalQty: number;
  totalDiscount: number; // in paise
  totalAmount: number; // in paise
  paidCash: number; // in paise
  paidCard: number; // in paise
  paidUPI: number; // in paise
  changeDue: number; // in paise
  customerPhone?: string;
  customerName?: string;
  status: 'COMPLETED' | 'CANCELLED' | 'RETURNED' | 'HELD';
  createdAt: string;
}

export interface DayCloseReport {
  id: string;
  date: string;
  registerId: string;
  cashierStaffId: number;
  cashierName: string;
  systemCash: number; // paise
  systemCard: number; // paise
  systemUPI: number; // paise
  countedCash: number; // paise
  denominations: DenominationBreakdown;
  variance: number; // paise
  status: CashVarianceStatus;
  isCloseReturn: boolean;
  submittedAt: string;
}

export interface ManagerCashReport {
  id: string;
  date: string;
  registerId: string;
  posNumber: string;
  cashOfficerName: string;
  cashOfficerStaffId: number;
  managerName: string;
  denominations: DenominationBreakdown;
  cashTotal: number; // paise
  upiTotal: number; // paise
  cardTotal: number; // paise
  bnaReportedAmount: number; // paise
  systemTotalSales: number; // paise
  finalVariance: number; // paise
  varianceStatus: CashVarianceStatus;
  accountantApproved: boolean;
  accountantApprovedBy?: string;
  accountantApprovedAt?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityName: string;
  entityId: string;
  userStaffId: number;
  userName: string;
  userRole: string;
  beforeValue?: any;
  afterValue?: any;
  reason?: string;
  timestamp: string;
}

export interface HardwareStatus {
  barcodeScannerConnected: boolean;
  edcTerminalConnected: boolean;
  edcStatus: 'IDLE' | 'WAITING_FOR_CARD' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
  thermalPrinterConnected: boolean;
  upiProviderReady: boolean;
}
