import { User, Order, SystemNotification, Customer } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Ln. G. Shaik Alaudeen (Owner)',
    email: 'admin@gsdesigns.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    phone: '98432 19951'
  },
  {
    id: 'u-2',
    name: 'Ramesh K. (Lead Designer)',
    email: 'designer@gsdesigns.com',
    role: 'DESIGNER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    phone: '94431 88210'
  },
  {
    id: 'u-5',
    name: 'Arun M. (Press Operator)',
    email: 'printing@gsdesigns.com',
    role: 'PRINTING',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    phone: '94422 33445'
  },
  {
    id: 'u-3',
    name: 'Priya M. (Billing Desk)',
    email: 'billing@gsdesigns.com',
    role: 'BILLING',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    phone: '77088 66844'
  },
  {
    id: 'u-4',
    name: 'Senthil V. (Junior Designer)',
    email: 'senthil@gsdesigns.com',
    role: 'DESIGNER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    phone: '98433 11223'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Kaveri Medical Center',
    phone: '98765 43210',
    email: 'info@kaverimed.org',
    gstNo: '33AAAAA0000A1Z5',
    address: 'Main Road, Nagapattinam',
    totalOrdersCount: 4,
    totalSpent: 18500,
    pendingBalance: 800,
    pendingDues: 800,
    lastOrderDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'cust-2',
    name: 'Anbarasu & Family Wedding',
    phone: '94432 55441',
    address: 'Velippalayam, Nagapattinam',
    totalOrdersCount: 1,
    totalSpent: 6500,
    pendingBalance: 3500,
    pendingDues: 3500,
    lastOrderDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'cust-3',
    name: 'Royal Sweets & Bakery',
    phone: '98421 99001',
    gstNo: '33BCCCC1111B2Z8',
    address: 'Public Office Road, Nagapattinam',
    totalOrdersCount: 3,
    totalSpent: 14200,
    pendingBalance: 1500,
    pendingDues: 1500,
    lastOrderDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'cust-4',
    name: 'Nagapattinam Sports Club',
    phone: '97890 12345',
    address: 'Beach Road, Nagapattinam',
    totalOrdersCount: 2,
    totalSpent: 22000,
    pendingBalance: 7500,
    pendingDues: 7500,
    lastOrderDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    jobNo: 'GS-2026-001',
    customerName: 'Kaveri Medical Center',
    customerPhone: '98765 43210',
    customerEmail: 'info@kaverimed.org',
    customerGstNo: '33AAAAA0000A1Z5',
    category: 'FLEX',
    title: 'Main Highway Shop Board Flex',
    description: 'Star Flex Banner with 1-inch pipe frame finish. Include Emergency phone 24/7 in Red bold text.',
    flexSpecs: {
      widthFt: 12,
      heightFt: 6,
      sqFt: 72,
      ratePerSqFt: 25,
      finishType: 'Star Flex',
      frameIncluded: true
    },
    designerId: 'u-2',
    designerName: 'Ramesh K. (Lead Designer)',
    status: 'DESIGN_READY',
    totalAmount: 1800,
    advancePaid: 1000,
    dueBalance: 800,
    gstPercent: 18,
    gstAmount: 324,
    invoiceNo: 'INV-2026-001',
    designFileUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    designPreviewName: 'Kaveri_Flex_v2_FinalProof.png',
    designerNotes: 'Design complete with high-resolution logos and emergency phone highlighted in green/red.',
    designerCompletedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    paymentMethod: 'GPay / UPI',
    payments: [
      {
        id: 'pay-1',
        orderId: 'ord-101',
        jobNo: 'GS-2026-001',
        amount: 1000,
        paymentMode: 'GPay / UPI',
        transactionRef: 'UPI/984321/99201',
        receivedBy: 'Ln. G. Shaik Alaudeen',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        isAdvance: true,
        notes: 'Advance paid at booking time'
      }
    ],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't-1',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN',
        notes: 'Order received & assigned to Ramesh.'
      },
      {
        id: 't-2',
        status: 'DESIGN_READY',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedBy: 'Ramesh K.',
        role: 'DESIGNER',
        notes: 'Design finalized. Proof attached.'
      }
    ]
  },
  {
    id: 'ord-105',
    jobNo: 'GS-2026-005',
    customerName: 'Arun Spices & Grocery',
    customerPhone: '98432 77112',
    category: 'FLEX',
    title: 'Grand Opening Banner - 12x6 ft',
    description: 'Star Flex Banner with eyelets for grand opening.',
    flexSpecs: {
      widthFt: 12,
      heightFt: 6,
      sqFt: 72,
      ratePerSqFt: 25,
      finishType: 'Star Flex',
      frameIncluded: false
    },
    designerId: 'u-2',
    designerName: 'Ramesh K. (Lead Designer)',
    status: 'PRINTING_IN_PROGRESS',
    totalAmount: 1800,
    advancePaid: 500,
    dueBalance: 1300,
    gstPercent: 18,
    gstAmount: 324,
    designFileUrl: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&q=80&w=800',
    designPreviewName: 'ArunSpices_Banner_PrintReady.pdf',
    designerNotes: 'CMYK Color profile prepared for Roland printer.',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't-9',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN'
      },
      {
        id: 't-10',
        status: 'PRINTING_IN_PROGRESS',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN',
        notes: 'Forwarded to Printing Machine Room.'
      }
    ]
  },
  {
    id: 'ord-102',
    jobNo: 'GS-2026-002',
    customerName: 'Anbarasu & Family Wedding',
    customerPhone: '94432 55441',
    category: 'INVITATION',
    title: 'Marriage Invitation Cards - 500 Pcs',
    description: 'Gold foil embossing on Premium Glossy Red Card. Tamil wedding format template #04.',
    invitationSpecs: {
      quantity: 500,
      paperType: 'Glossy 300GSM',
      printType: 'Foil Stamping'
    },
    designerId: 'u-2',
    designerName: 'Ramesh K. (Lead Designer)',
    status: 'ASSIGNED_TO_DESIGNER',
    totalAmount: 6500,
    advancePaid: 3000,
    dueBalance: 3500,
    gstPercent: 12,
    gstAmount: 780,
    invoiceNo: 'INV-2026-002',
    paymentMethod: 'Cash',
    payments: [
      {
        id: 'pay-2',
        orderId: 'ord-102',
        jobNo: 'GS-2026-002',
        amount: 3000,
        paymentMode: 'Cash',
        receivedBy: 'Ln. G. Shaik Alaudeen',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isAdvance: true,
        notes: 'Cash advance collected'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-3',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN',
        notes: 'Assigned to designer with Tamil wording copy.'
      }
    ]
  },
  {
    id: 'ord-103',
    jobNo: 'GS-2026-003',
    customerName: 'Royal Sweets & Bakery',
    customerPhone: '98421 99001',
    customerGstNo: '33BCCCC1111B2Z8',
    category: 'LOGO',
    title: 'Brand Logo & Packaging Label',
    description: 'New Logo design with modern typography & vector graphics for sweet boxes.',
    generalSpecs: {
      itemType: 'Vector Logo Package',
      quantity: 1,
      notes: 'Requires 3 initial concepts'
    },
    designerId: 'u-4',
    designerName: 'Senthil V. (Junior Designer)',
    status: 'DESIGN_READY',
    totalAmount: 3500,
    advancePaid: 2000,
    dueBalance: 1500,
    gstPercent: 18,
    gstAmount: 630,
    invoiceNo: 'INV-2026-003',
    designFileUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
    designPreviewName: 'RoyalSweets_Logo_Concept3.png',
    designerNotes: 'Created 3 logo variants. Concept 3 selected by client over WhatsApp.',
    designerCompletedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    paymentMethod: 'GPay / UPI',
    payments: [
      {
        id: 'pay-3',
        orderId: 'ord-103',
        jobNo: 'GS-2026-003',
        amount: 2000,
        paymentMode: 'GPay / UPI',
        transactionRef: 'GP/2026/88123',
        receivedBy: 'Ln. G. Shaik Alaudeen',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        isAdvance: true
      }
    ],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't-4',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN',
        notes: 'Assigned to Senthil.'
      },
      {
        id: 't-5',
        status: 'DESIGN_READY',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedBy: 'Senthil V.',
        role: 'DESIGNER',
        notes: 'Concept ready for Admin approval.'
      }
    ]
  },
  {
    id: 'ord-104',
    jobNo: 'GS-2026-004',
    customerName: 'Nagapattinam Sports Club',
    customerPhone: '97890 12345',
    category: 'SHIELD_MEMENTO',
    title: 'Tournament Wooden Trophies with Brass Plate',
    description: '25 Wooden Shields with custom engraved brass text for Cricket Tournament Winners.',
    generalSpecs: {
      itemType: 'Wooden Shield Trophy',
      quantity: 25,
      notes: 'Brass Plate Engraving'
    },
    designerId: 'u-2',
    designerName: 'Ramesh K. (Lead Designer)',
    status: 'FORWARDED_TO_BILLING',
    totalAmount: 12500,
    advancePaid: 5000,
    dueBalance: 7500,
    gstPercent: 18,
    gstAmount: 2250,
    invoiceNo: 'INV-2026-004',
    designFileUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
    designPreviewName: 'Trophy_BrassPlate_Proof.pdf',
    designerNotes: 'Engraving text formatted and verified.',
    paymentMethod: 'Bank Transfer',
    payments: [
      {
        id: 'pay-4',
        orderId: 'ord-104',
        jobNo: 'GS-2026-004',
        amount: 5000,
        paymentMode: 'Bank Transfer',
        transactionRef: 'NEFT/INDIANBANK/55102',
        receivedBy: 'Ln. G. Shaik Alaudeen',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        isAdvance: true
      }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-6',
        status: 'ASSIGNED_TO_DESIGNER',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN'
      },
      {
        id: 't-7',
        status: 'DESIGN_READY',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedBy: 'Ramesh K.',
        role: 'DESIGNER'
      },
      {
        id: 't-8',
        status: 'FORWARDED_TO_BILLING',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        updatedBy: 'Ln. G. Shaik Alaudeen',
        role: 'ADMIN',
        notes: 'Reviewed design. Approved and forwarded to Billing & Printing department.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    orderId: 'ord-101',
    jobNo: 'GS-2026-001',
    title: '🎨 Design Completed!',
    message: 'Ramesh K. marked Kaveri Medical Center flex design as READY.',
    type: 'DESIGN_READY',
    isRead: false,
    roleTarget: 'ADMIN',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'n-2',
    orderId: 'ord-103',
    jobNo: 'GS-2026-003',
    title: '🎨 Design Completed!',
    message: 'Senthil V. marked Royal Sweets logo design as READY.',
    type: 'DESIGN_READY',
    isRead: false,
    roleTarget: 'ADMIN',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];
