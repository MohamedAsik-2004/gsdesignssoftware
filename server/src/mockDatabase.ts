import { User, Order, SystemNotification, Customer } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Ln. G. Senthilkumar',
    role: 'ADMIN',
    email: 'gsdesignsngt@gmail.com',
    phone: '98432 19951',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    designation: 'Managing Director / Owner',
    pin: '1234'
  },
  {
    id: 'u-2',
    name: 'Ramesh K.',
    role: 'DESIGNER',
    email: 'ramesh.gsdesigns@gmail.com',
    phone: '94432 88123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    designation: 'Senior Graphic Designer (Flex & Offset)',
    pin: '2222'
  },
  {
    id: 'u-3',
    name: 'Senthil Nathan',
    role: 'DESIGNER',
    email: 'senthil.design@gmail.com',
    phone: '97890 44112',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    designation: 'UI/UX & Logo Specialist',
    pin: '3333'
  },
  {
    id: 'u-4',
    name: 'Arun M.',
    role: 'PRINTING',
    email: 'arun.press@gsdesigns.in',
    phone: '98432 77112',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    designation: 'Press Operator & Machine Engineer',
    pin: '4444'
  },
  {
    id: 'u-5',
    name: 'Kavitha S.',
    role: 'BILLING',
    email: 'kavitha.billing@gsdesigns.in',
    phone: '77088 66844',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    designation: 'Accounts & Front Desk Billing Specialist',
    pin: '5555'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    jobNo: 'GS-2026-001',
    invoiceNo: 'INV-2026-001',
    customerName: 'Kaveri Medical Center',
    customerPhone: '98765 43210',
    customerEmail: 'info@kaverimedical.com',
    customerGstNo: '33AAACK1234F1Z9',
    category: 'FLEX',
    title: 'Main Highway Shop Board Flex',
    description: 'Star Flex Banner with 1-inch pipe frame finish. Include Emergency phone 24/7 in Red bold text.',
    flexSpecs: {
      widthFt: 12,
      heightFt: 6,
      sqFt: 72,
      flexType: 'Star Flex',
      frameRequired: true,
      frameType: '1-inch Square Pipe',
      lamination: false
    },
    designerId: 'u-2',
    designerName: 'Ramesh K.',
    proofUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600',
    proofName: 'Kaveri_Flex_v2_FinalProof.png',
    status: 'DESIGN_READY',
    totalAmount: 1800,
    advancePaid: 1000,
    dueBalance: 800,
    discount: 0,
    gstPercent: 18,
    gstAmount: 324,
    paymentMethod: 'GPay / UPI',
    payments: [
      {
        id: 'pay-1',
        orderId: 'ord-101',
        jobNo: 'GS-2026-001',
        amount: 1000,
        paymentMode: 'GPay / UPI',
        transactionRef: 'UPI/38291049281',
        receivedBy: 'Ln. G. Senthilkumar',
        createdAt: '2026-08-28T10:15:00Z',
        isAdvance: true,
        notes: 'Advance paid at counter via GPay'
      }
    ],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-28T11:30:00Z',
    timeline: [
      {
        id: 't-1',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: '2026-08-28T10:00:00Z',
        updatedBy: 'Ln. G. Senthilkumar',
        role: 'ADMIN',
        notes: 'Order received at admin desk and assigned to Ramesh.'
      },
      {
        id: 't-2',
        status: 'DESIGN_READY',
        timestamp: '2026-08-28T11:30:00Z',
        updatedBy: 'Ramesh K.',
        role: 'DESIGNER',
        notes: 'High-res Star Flex design proof uploaded. Waiting for admin approval.',
        proofUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600',
        proofName: 'Kaveri_Flex_v2_FinalProof.png'
      }
    ]
  },
  {
    id: 'ord-102',
    jobNo: 'GS-2026-002',
    invoiceNo: 'INV-2026-002',
    customerName: 'Anbarasu & Family',
    customerPhone: '94432 55441',
    category: 'INVITATION',
    title: 'Marriage Invitation Cards (Golden Emboss)',
    description: 'Traditional Tamil Wedding Invitation with Gold Foil Ganesha logo and Board envelope.',
    invitationSpecs: {
      cardType: 'Royal Folded Metallic Board',
      quantity: 500,
      paperGsm: '300 GSM Premium Board',
      printingType: 'Foil Printing',
      coverIncluded: true
    },
    designerId: 'u-2',
    designerName: 'Ramesh K.',
    status: 'ASSIGNED_TO_DESIGNER',
    totalAmount: 6500,
    advancePaid: 3000,
    dueBalance: 3500,
    discount: 0,
    gstPercent: 18,
    gstAmount: 1170,
    paymentMethod: 'Cash',
    payments: [
      {
        id: 'pay-2',
        orderId: 'ord-102',
        jobNo: 'GS-2026-002',
        amount: 3000,
        paymentMode: 'Cash',
        receivedBy: 'Ln. G. Senthilkumar',
        createdAt: '2026-08-28T11:00:00Z',
        isAdvance: true,
        notes: 'Cash booking advance'
      }
    ],
    createdAt: '2026-08-28T11:00:00Z',
    updatedAt: '2026-08-28T11:05:00Z',
    timeline: [
      {
        id: 't-3',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: '2026-08-28T11:05:00Z',
        updatedBy: 'Ln. G. Senthilkumar',
        role: 'ADMIN',
        notes: 'Wedding card draft details handed to Ramesh.'
      }
    ]
  },
  {
    id: 'ord-105',
    jobNo: 'GS-2026-005',
    invoiceNo: 'INV-2026-005',
    customerName: 'Arun Spices & Grocery',
    customerPhone: '98432 77112',
    category: 'FLEX',
    title: 'Grand Opening Banner - 12x6 ft',
    description: 'Star Flex Banner with eyelets for grand opening.',
    flexSpecs: {
      widthFt: 12,
      heightFt: 6,
      sqFt: 72,
      flexType: 'Star Flex',
      frameRequired: false
    },
    designerId: 'u-2',
    designerName: 'Ramesh K.',
    proofUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&q=80&w=600',
    proofName: 'ArunSpices_Banner_PrintReady.pdf',
    status: 'PRINTING_IN_PROGRESS',
    totalAmount: 1800,
    advancePaid: 500,
    dueBalance: 1300,
    discount: 0,
    gstPercent: 18,
    gstAmount: 324,
    paymentMethod: 'GPay / UPI',
    payments: [
      {
        id: 'pay-5',
        orderId: 'ord-105',
        jobNo: 'GS-2026-005',
        amount: 500,
        paymentMode: 'GPay / UPI',
        receivedBy: 'Ln. G. Senthilkumar',
        createdAt: '2026-08-28T12:00:00Z',
        isAdvance: true
      }
    ],
    createdAt: '2026-08-28T12:00:00Z',
    updatedAt: '2026-08-28T14:00:00Z',
    timeline: [
      {
        id: 't-8',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: '2026-08-28T12:00:00Z',
        updatedBy: 'Ln. G. Senthilkumar',
        role: 'ADMIN'
      },
      {
        id: 't-9',
        status: 'PRINTING_IN_PROGRESS',
        timestamp: '2026-08-28T14:00:00Z',
        updatedBy: 'Arun M.',
        role: 'PRINTING',
        notes: 'Star Flex loaded on Solvent Printer Machine #1.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    orderId: 'ord-101',
    jobNo: 'GS-2026-001',
    title: '✨ Design Proof Uploaded!',
    message: 'Ramesh uploaded final proof for Kaveri Medical Center (Job GS-2026-001). Ready for Admin Review.',
    type: 'DESIGN_READY',
    isRead: false,
    roleTarget: 'ADMIN',
    createdAt: '2026-08-28T11:30:00Z'
  },
  {
    id: 'notif-2',
    orderId: 'ord-105',
    jobNo: 'GS-2026-005',
    title: '🖨️ Printing Started in Press Room',
    message: 'Arun started Star Flex printing for Arun Spices (Job GS-2026-005).',
    type: 'PRINTING_STARTED',
    isRead: false,
    roleTarget: 'ADMIN',
    createdAt: '2026-08-28T14:00:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Kaveri Medical Center',
    phone: '98765 43210',
    email: 'info@kaverimedical.com',
    gstNo: '33AAACK1234F1Z9',
    totalOrdersCount: 4,
    totalSpent: 14500,
    pendingDues: 800,
    pendingBalance: 800,
    lastOrderDate: '2026-08-28'
  },
  {
    id: 'cust-2',
    name: 'Anbarasu & Family',
    phone: '94432 55441',
    totalOrdersCount: 1,
    totalSpent: 6500,
    pendingDues: 3500,
    pendingBalance: 3500,
    lastOrderDate: '2026-08-28'
  }
];

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Database Store with Disk Persistence
class DatabaseStore {
  private users: User[] = INITIAL_USERS;
  private orders: Order[] = INITIAL_ORDERS;
  private notifications: SystemNotification[] = INITIAL_NOTIFICATIONS;
  private customers: Customer[] = INITIAL_CUSTOMERS;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.orders && Array.isArray(parsed.orders)) this.orders = parsed.orders;
        if (parsed.customers && Array.isArray(parsed.customers)) this.customers = parsed.customers;
        if (parsed.notifications && Array.isArray(parsed.notifications)) this.notifications = parsed.notifications;
        if (parsed.users && Array.isArray(parsed.users)) this.users = parsed.users;
        console.log(`[DB Persistence] Successfully loaded ${this.orders.length} orders and ${this.customers.length} customers from ${DB_FILE}`);
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('[DB Persistence Error] Failed to load data from disk, falling back to defaults:', err);
    }
  }

  private saveToDisk() {
    try {
      const data = {
        users: this.users,
        orders: this.orders,
        notifications: this.notifications,
        customers: this.customers,
        lastSavedAt: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB Persistence Error] Failed to save data to disk:', err);
    }
  }

  // Users
  getUsers() { return this.users; }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  getUserByRole(role: string) { return this.users.find(u => u.role === role); }

  // Orders
  getOrders() { return this.orders; }
  getOrderById(id: string) { return this.orders.find(o => o.id === id); }
  
  createOrder(orderData: Partial<Order>, createdBy: User): Order {
    const now = new Date().toISOString();
    const count = this.orders.length + 1;
    const jobNo = `GS-2026-${String(count).padStart(3, '0')}`;
    const invoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      jobNo,
      invoiceNo,
      customerName: orderData.customerName || 'Walk-in Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail,
      customerGstNo: orderData.customerGstNo,
      category: orderData.category || 'FLEX',
      title: orderData.title || 'Untitled Order',
      description: orderData.description || '',
      flexSpecs: orderData.flexSpecs,
      invitationSpecs: orderData.invitationSpecs,
      noticeSpecs: orderData.noticeSpecs,
      generalSpecs: orderData.generalSpecs,
      designerId: orderData.designerId || 'u-2',
      designerName: orderData.designerName || 'Ramesh K.',
      status: 'ASSIGNED_TO_DESIGNER',
      totalAmount: orderData.totalAmount || 0,
      advancePaid: orderData.advancePaid || 0,
      dueBalance: (orderData.totalAmount || 0) - (orderData.advancePaid || 0),
      discount: orderData.discount || 0,
      gstPercent: orderData.gstPercent || 18,
      gstAmount: Math.round(((orderData.totalAmount || 0) * (orderData.gstPercent || 18)) / 100),
      paymentMethod: orderData.paymentMethod || 'Pending',
      payments: orderData.payments || [],
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: 't-' + Date.now(),
          status: 'ASSIGNED_TO_DESIGNER',
          timestamp: now,
          updatedBy: createdBy.name,
          role: createdBy.role,
          notes: `Order created and assigned to ${orderData.designerName || 'Designer'}`
        }
      ]
    };

    this.orders.unshift(newOrder);
    this.syncCustomer(newOrder.customerName, newOrder.customerPhone, newOrder.totalAmount, newOrder.dueBalance);
    this.saveToDisk();
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>, updatedBy: User, timelineNote?: string): Order | null {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    const existing = this.orders[index];
    const now = new Date().toISOString();

    const newTimelineEntry = {
      id: 't-' + Date.now(),
      status: updates.status || existing.status,
      timestamp: now,
      updatedBy: updatedBy.name,
      role: updatedBy.role,
      notes: timelineNote || `Status updated to ${(updates.status || existing.status).replace(/_/g, ' ')}`,
      proofUrl: updates.proofUrl || existing.proofUrl,
      proofName: updates.proofName || existing.proofName
    };

    const updatedOrder: Order = {
      ...existing,
      ...updates,
      updatedAt: now,
      timeline: [...existing.timeline, newTimelineEntry]
    };

    this.orders[index] = updatedOrder;
    this.saveToDisk();
    return updatedOrder;
  }

  deleteOrder(id: string): boolean {
    const len = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== id);
    const deleted = this.orders.length < len;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // Notifications
  getNotifications() { return this.notifications; }

  createNotification(notifData: Partial<SystemNotification>): SystemNotification {
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      orderId: notifData.orderId || '',
      jobNo: notifData.jobNo || '',
      title: notifData.title || 'System Notification',
      message: notifData.message || '',
      type: notifData.type || 'ASSIGNED',
      isRead: false,
      roleTarget: notifData.roleTarget || 'ALL',
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    this.saveToDisk();
    return notif;
  }

  markNotificationRead(id: string) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.saveToDisk();
  }

  clearNotifications() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.saveToDisk();
  }

  // Customers
  getCustomers() { return this.customers; }

  private syncCustomer(name: string, phone: string, amount: number, due: number) {
    const existing = this.customers.find(c => c.phone === phone);
    const today = new Date().toISOString().split('T')[0];

    if (existing) {
      existing.totalOrdersCount += 1;
      existing.totalSpent += amount;
      existing.pendingDues += due;
      existing.lastOrderDate = today;
    } else {
      this.customers.push({
        id: 'cust-' + Date.now(),
        name,
        phone,
        totalOrdersCount: 1,
        totalSpent: amount,
        pendingDues: due,
        pendingBalance: due,
        lastOrderDate: today
      });
    }
  }
}

export const db = new DatabaseStore();
