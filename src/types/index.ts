export type UserRole = 'ADMIN' | 'DESIGNER' | 'PRINTING' | 'BILLING';

export type OrderCategory = 'FLEX' | 'INVITATION' | 'NOTICE' | 'GENERAL' | 'LOGO' | 'SHIELD_MEMENTO' | 'OTHER';

export type OrderStatus = 
  | 'ASSIGNED_TO_DESIGNER' 
  | 'DESIGN_IN_PROGRESS' 
  | 'DESIGN_READY' 
  | 'PRINTING_IN_PROGRESS'
  | 'PRINT_READY'
  | 'FORWARDED_TO_BILLING'
  | 'BILLED_PRINTING'
  | 'COMPLETED';

export type PaymentMode = 'Cash' | 'GPay / UPI' | 'Card' | 'Bank Transfer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
  pin?: string;
  phone?: string;
  designation?: string;
}

export interface FlexSpecs {
  widthFt: number;
  heightFt: number;
  sqFt?: number;
  squareFeet?: number;
  ratePerSqFt: number;
  finishType?: string;
  flexType?: string;
  materialType?: string;
  frameIncluded?: boolean;
  frameRequired?: boolean;
  mountingReq?: boolean;
  frameReq?: boolean;
  mounting?: boolean;
  frame?: boolean;
}

export interface InvitationSpecs {
  cardType?: string;
  cardSize?: string;
  quantity: number;
  printingType?: string;
  printType?: string;
  paperGsm?: string;
  paperType?: string;
  gsm?: string;
}

export interface NoticeSpecs {
  paperSize?: string;
  size?: string;
  colorType?: string;
  printColor?: string;
  printType?: string;
  quantity: number;
  paperGsm?: string;
  gsm?: string;
}

export interface GeneralSpecs {
  itemType: string;
  unitPrice?: number;
  quantity: number;
  notes?: string;
  total?: number;
}

export interface TimelineEntry {
  id: string;
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  role: UserRole;
  notes?: string;
  proofUrl?: string;
  proofName?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  jobNo: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  receivedBy: string;
  createdAt: string;
  notes?: string;
  isAdvance?: boolean;
}

export interface Order {
  id: string;
  jobNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGstNo?: string;
  category: OrderCategory;
  title: string;
  description: string;
  
  flexSpecs?: FlexSpecs;
  invitationSpecs?: InvitationSpecs;
  noticeSpecs?: NoticeSpecs;
  generalSpecs?: GeneralSpecs;
  
  designerId: string;
  designerName: string;
  status: OrderStatus;
  
  totalAmount: number;
  advancePaid: number;
  dueBalance: number;
  discount?: number;
  gstPercent?: number;
  gstAmount?: number;
  
  proofUrl?: string;
  proofName?: string;
  designFileUrl?: string;
  designPreviewName?: string;
  designerNotes?: string;
  adminNotes?: string;
  designerCompletedAt?: string;
  
  invoiceNo?: string;
  paymentMethod?: PaymentMode | 'Pending';
  payments?: PaymentTransaction[];
  
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gstNo?: string;
  address?: string;
  totalOrdersCount: number;
  totalSpent: number;
  pendingDues: number;
  pendingBalance: number;
  lastOrderDate: string;
}

export interface DailyClosingReport {
  date: string;
  totalCollected: number;
  cashCollected: number;
  upiCollected: number;
  cardCollected: number;
  bankCollected: number;
  totalOrdersCompleted: number;
  pendingDuesTotal: number;
}

export interface SystemNotification {
  id: string;
  orderId: string;
  jobNo: string;
  title: string;
  message: string;
  type: 'DESIGN_READY' | 'ASSIGNED' | 'PRINT_READY' | 'PRINTING_STARTED' | 'BILLING_FORWARDED' | 'FORWARDED_BILLING' | 'PAYMENT_RECEIVED' | 'INFO' | 'SYSTEM' | 'ANNOUNCEMENT';
  isRead: boolean;
  roleTarget: UserRole | 'ALL';
  createdAt: string;
}
