import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  OrderStatus, 
  SystemNotification, 
  TimelineEntry, 
  PaymentTransaction, 
  PaymentMode, 
  Customer, 
  DailyClosingReport 
} from '../types';
import { INITIAL_ORDERS, INITIAL_NOTIFICATIONS, INITIAL_CUSTOMERS } from '../data/initialData';
import { useAuth } from './AuthContext';
import { socket, joinDeskRoom } from '../services/socket';
import { soundEngine } from '../utils/sound';
import { 
  fetchOrdersApi, 
  createOrderApi, 
  updateOrderStatusApi, 
  recordPaymentApi, 
  reassignDesignerApi, 
  deleteOrderApi 
} from '../services/api';

interface ActiveToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'ready';
}

interface OrderContextType {
  orders: Order[];
  customers: Customer[];
  notifications: SystemNotification[];
  toasts: ActiveToast[];
  createOrder: (orderData: Partial<Order>) => void;
  markDesignReady: (orderId: string, proofUrl: string, proofName: string, notes: string) => void;
  forwardToBilling: (orderId: string, notes?: string) => void;
  recordPayment: (orderId: string, amount: number, paymentMode: PaymentMode, transactionRef?: string, notes?: string) => void;
  updateGstAndInvoice: (orderId: string, gstPercent: number, discount?: number) => void;
  completeOrder: (orderId: string, invoiceNo?: string, paymentMethod?: PaymentMode) => void;
  reassignDesigner: (orderId: string, designerId: string, designerName: string) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  getDailyClosingReport: () => DailyClosingReport;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'ready') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gs_orders_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gs_customers_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('gs_notifications_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  // 1. Initial Load: Sync with Express Backend API
  useEffect(() => {
    async function syncOrdersWithBackend() {
      try {
        const liveOrders = await fetchOrdersApi();
        if (liveOrders && liveOrders.length > 0) {
          setOrders(liveOrders);
        }
      } catch (err) {
        console.warn('Backend API server offline or unreachable. Operating in local mode.', err);
      }
    }
    syncOrdersWithBackend();
  }, []);

  // 2. Real-time Synchronization via Socket.io
  useEffect(() => {
    joinDeskRoom(currentUser.role);

    // Socket Event: New Order Created
    const handleOrderCreated = (data: { order: Order; notification?: SystemNotification }) => {
      setOrders(prev => [data.order, ...prev.filter(o => o.id !== data.order.id)]);
      soundEngine.playMessageSound();
      if (data.notification) {
        setNotifications(prev => [data.notification!, ...prev]);
        showToast('Real-Time Order Alert', data.notification.message, 'info');
      }
    };

    // Socket Event: Order Updated
    const handleOrderUpdated = (data: { order: Order; notification?: SystemNotification }) => {
      setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
      
      if (data.order.status === 'COMPLETED') {
        soundEngine.playSuccessSound();
      } else if (data.order.status === 'DESIGN_READY') {
        soundEngine.playAlertSound();
      } else {
        soundEngine.playMessageSound();
      }

      if (data.notification) {
        setNotifications(prev => [data.notification!, ...prev]);
        showToast(
          data.notification.title,
          data.notification.message,
          data.notification.type === 'DESIGN_READY' ? 'ready' : 'success'
        );
      }
    };

    // Socket Event: Order Deleted
    const handleOrderDeleted = (data: { id: string }) => {
      setOrders(prev => prev.filter(o => o.id !== data.id));
      showToast('Order Deleted', 'An order was deleted by admin.', 'warning');
    };

    // Socket Event: Inter-Terminal Announcement Broadcast
    const handleAnnouncement = (data: {
      id: string;
      senderName: string;
      senderRole: string;
      message: string;
      urgent?: boolean;
      timestamp: string;
    }) => {
      if (data.urgent) {
        soundEngine.playAlertSound();
      } else {
        soundEngine.playChime();
      }

      const notif: SystemNotification = {
        id: data.id,
        orderId: 'announcement',
        jobNo: 'BROADCAST',
        title: `📢 Announcement from ${data.senderRole} Desk (${data.senderName})`,
        message: data.message,
        type: 'SYSTEM',
        isRead: false,
        roleTarget: 'ALL',
        createdAt: data.timestamp
      };

      setNotifications(prev => [notif, ...prev]);
      showToast(
        `📢 ${data.senderRole} Desk Alert (${data.senderName})`,
        data.message,
        data.urgent ? 'warning' : 'info'
      );
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);
    socket.on('order:deleted', handleOrderDeleted);
    socket.on('terminal_announcement', handleAnnouncement);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
      socket.off('order:deleted', handleOrderDeleted);
      socket.off('terminal_announcement', handleAnnouncement);
    };
  }, [currentUser.role]);

  useEffect(() => {
    localStorage.setItem('gs_orders_data', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gs_customers_data', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('gs_notifications_data', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'ready' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const syncCustomer = (name: string, phone: string, total: number, due: number) => {
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === phone);
      const today = new Date().toISOString().split('T')[0];

      if (existing) {
        return prev.map(c => c.phone === phone ? {
          ...c,
          totalOrdersCount: c.totalOrdersCount + 1,
          totalSpent: c.totalSpent + total,
          pendingDues: c.pendingDues + due,
          lastOrderDate: today
        } : c);
      }

      const newCustomer: Customer = {
        id: 'cust-' + Date.now(),
        name,
        phone,
        totalOrdersCount: 1,
        totalSpent: total,
        pendingDues: due,
        pendingBalance: due,
        lastOrderDate: today
      };

      return [...prev, newCustomer];
    });
  };

  // 1. Create New Order (Admin)
  const createOrder = async (orderData: Partial<Order>) => {
    const now = new Date().toISOString();
    const count = orders.length + 1;
    const jobNo = `GS-2026-${String(count).padStart(3, '0')}`;
    const invoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;

    const newTimeline: TimelineEntry = {
      id: 't-' + Date.now(),
      status: 'ASSIGNED_TO_DESIGNER',
      timestamp: now,
      updatedBy: currentUser.name,
      role: currentUser.role,
      notes: `Order created and assigned to ${orderData.designerName || 'Designer'}`
    };

    const total = orderData.totalAmount || 0;
    const advance = orderData.advancePaid || 0;
    const due = total - advance;

    const initialPayments: PaymentTransaction[] = [];
    if (advance > 0) {
      initialPayments.push({
        id: 'pay-' + Date.now(),
        orderId: 'ord-' + Date.now(),
        jobNo,
        amount: advance,
        paymentMode: orderData.paymentMethod && orderData.paymentMethod !== 'Pending' ? (orderData.paymentMethod as PaymentMode) : 'Cash',
        receivedBy: currentUser.name,
        createdAt: now,
        isAdvance: true,
        notes: 'Advance booking payment'
      });
    }

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
      totalAmount: total,
      advancePaid: advance,
      dueBalance: due,
      discount: orderData.discount || 0,
      gstPercent: orderData.gstPercent || 18,
      gstAmount: Math.round((total * (orderData.gstPercent || 18)) / 100),
      paymentMethod: orderData.paymentMethod || (advance > 0 ? 'Cash' : 'Pending'),
      payments: initialPayments,
      createdAt: now,
      updatedAt: now,
      timeline: [newTimeline]
    };

    try {
      await createOrderApi(newOrder);
    } catch (e) {
      console.warn('Backend create failed, updating locally', e);
    }

    setOrders(prev => [newOrder, ...prev]);
    syncCustomer(newOrder.customerName, newOrder.customerPhone, total, due);

    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      orderId: newOrder.id,
      jobNo: newOrder.jobNo,
      title: '📌 New Design Job Assigned!',
      message: `New order "${newOrder.title}" assigned to you by ${currentUser.name}.`,
      type: 'ASSIGNED',
      isRead: false,
      roleTarget: 'DESIGNER',
      createdAt: now
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(
      'Order Created & Forwarded',
      `Job ${jobNo} assigned to ${newOrder.designerName} successfully!`,
      'success'
    );
  };

  // 2. Mark Design Ready (Designer Action!)
  const markDesignReady = async (orderId: string, proofUrl: string, proofName: string, notes: string) => {
    try {
      await updateOrderStatusApi(orderId, 'DESIGN_READY', notes, proofUrl, proofName);
    } catch (e) {
      console.warn('Backend update failed, applying locally', e);
    }

    const now = new Date().toISOString();

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timelineEntry: TimelineEntry = {
          id: 't-' + Date.now(),
          status: 'DESIGN_READY',
          timestamp: now,
          updatedBy: currentUser.name,
          role: currentUser.role,
          notes: notes || 'Proof uploaded and design marked ready.',
          proofUrl,
          proofName
        };

        return {
          ...order,
          status: 'DESIGN_READY',
          proofUrl,
          proofName,
          designerNotes: notes,
          updatedAt: now,
          timeline: [...order.timeline, timelineEntry]
        };
      }
      return order;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      orderId,
      jobNo: targetOrder?.jobNo || '',
      title: '✨ Design Proof Uploaded!',
      message: `${currentUser.name} completed design for "${targetOrder?.title}". Ready for Admin Review!`,
      type: 'DESIGN_READY',
      isRead: false,
      roleTarget: 'ADMIN',
      createdAt: now
    };

    setNotifications(prev => [notif, ...prev]);

    showToast(
      'Design Ready Alert Sent!',
      `Proof uploaded for ${targetOrder?.jobNo}. Admin & Owner notified!`,
      'ready'
    );
  };

  // 3. Forward to Billing / Printing Desk (Admin Action!)
  const forwardToBilling = async (orderId: string, notes?: string) => {
    try {
      await updateOrderStatusApi(orderId, 'FORWARDED_TO_BILLING', notes);
    } catch (e) {
      console.warn('Backend update failed, applying locally', e);
    }

    const now = new Date().toISOString();

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timelineEntry: TimelineEntry = {
          id: 't-' + Date.now(),
          status: 'FORWARDED_TO_BILLING',
          timestamp: now,
          updatedBy: currentUser.name,
          role: currentUser.role,
          notes: notes || 'Approved design proof and forwarded order to billing desk.'
        };

        return {
          ...order,
          status: 'FORWARDED_TO_BILLING',
          adminNotes: notes,
          updatedAt: now,
          timeline: [...order.timeline, timelineEntry]
        };
      }
      return order;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      orderId,
      jobNo: targetOrder?.jobNo || '',
      title: '🧾 Order Forwarded to Billing',
      message: `Job ${targetOrder?.jobNo} approved by Admin. Ready for invoice generation & payment.`,
      type: 'BILLING_FORWARDED',
      isRead: false,
      roleTarget: 'BILLING',
      createdAt: now
    };

    setNotifications(prev => [notif, ...prev]);

    showToast(
      'Forwarded to Billing Desk',
      `Job ${targetOrder?.jobNo} transferred to Billing Desk!`,
      'success'
    );
  };

  // 4. Record Payment & Balance Settlement (Billing Desk)
  const recordPayment = async (
    orderId: string, 
    amount: number, 
    paymentMode: PaymentMode, 
    transactionRef?: string, 
    notes?: string
  ) => {
    try {
      await recordPaymentApi(orderId, amount, paymentMode, transactionRef, notes);
    } catch (e) {
      console.warn('Backend payment failed, applying locally', e);
    }

    const now = new Date().toISOString();

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newPayment: PaymentTransaction = {
          id: 'pay-' + Date.now(),
          orderId,
          jobNo: order.jobNo,
          amount,
          paymentMode,
          transactionRef,
          receivedBy: currentUser.name,
          createdAt: now,
          notes
        };

        const existingPayments = order.payments || [];
        const updatedPayments = [...existingPayments, newPayment];
        const newAdvancePaid = order.advancePaid + amount;
        const newDueBalance = Math.max(0, order.totalAmount - newAdvancePaid);
        const isFullyPaid = newDueBalance === 0;

        const timelineEntry: TimelineEntry = {
          id: 't-' + Date.now(),
          status: isFullyPaid ? 'COMPLETED' : order.status,
          timestamp: now,
          updatedBy: currentUser.name,
          role: currentUser.role,
          notes: `Received payment of ₹${amount} via ${paymentMode}. Balance due: ₹${newDueBalance}.`
        };

        return {
          ...order,
          advancePaid: newAdvancePaid,
          dueBalance: newDueBalance,
          paymentMethod: paymentMode,
          payments: updatedPayments,
          status: isFullyPaid ? 'COMPLETED' : order.status,
          updatedAt: now,
          timeline: [...order.timeline, timelineEntry]
        };
      }
      return order;
    }));

    showToast('Payment Recorded', `₹${amount} received via ${paymentMode}.`, 'success');
  };

  // 5. Update GST % & Discount on Invoice
  const updateGstAndInvoice = (orderId: string, gstPercent: number, discount: number = 0) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const subtotalAfterDiscount = Math.max(0, order.totalAmount - discount);
        const newGstAmount = Math.round((subtotalAfterDiscount * gstPercent) / 100);
        const newDueBalance = Math.max(0, subtotalAfterDiscount - order.advancePaid);

        return {
          ...order,
          gstPercent,
          discount,
          gstAmount: newGstAmount,
          dueBalance: newDueBalance,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    showToast('Invoice Recalculated', `GST updated to ${gstPercent}%.`, 'info');
  };

  // 6. Complete Order & Issue Final Invoice
  const completeOrder = (orderId: string, invoiceNo?: string, paymentMethod?: PaymentMode) => {
    const now = new Date().toISOString();

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timelineEntry: TimelineEntry = {
          id: 't-' + Date.now(),
          status: 'COMPLETED',
          timestamp: now,
          updatedBy: currentUser.name,
          role: currentUser.role,
          notes: 'Full payment cleared and final invoice issued. Order completed.'
        };

        return {
          ...order,
          status: 'COMPLETED',
          dueBalance: 0,
          advancePaid: order.totalAmount,
          invoiceNo: invoiceNo || order.invoiceNo,
          paymentMethod: paymentMethod || order.paymentMethod,
          updatedAt: now,
          timeline: [...order.timeline, timelineEntry]
        };
      }
      return order;
    }));

    showToast('Order Completed!', 'Final invoice issued & order closed.', 'success');
  };

  // 7. Reassign Designer
  const reassignDesigner = async (orderId: string, designerId: string, designerName: string) => {
    try {
      await reassignDesignerApi(orderId, designerId, designerName);
    } catch (e) {
      console.warn('Backend reassign failed, applying locally', e);
    }

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          designerId,
          designerName,
          status: 'ASSIGNED_TO_DESIGNER',
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    showToast('Designer Reassigned', `Job reassigned to ${designerName}`, 'info');
  };

  // Generic Order Status Updater (e.g. Press Room & Custom Desks)
  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    try {
      await updateOrderStatusApi(orderId, status, notes);
    } catch (e) {
      console.warn('Backend update failed, applying locally', e);
    }

    const now = new Date().toISOString();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timelineEntry: TimelineEntry = {
          id: 't-' + Date.now(),
          status,
          timestamp: now,
          updatedBy: currentUser.name,
          role: currentUser.role,
          notes: notes || `Order status changed to ${status}`
        };
        return {
          ...order,
          status,
          updatedAt: now,
          timeline: [...order.timeline, timelineEntry]
        };
      }
      return order;
    }));
    showToast('Workflow Updated', `Order status changed to ${status.replace(/_/g, ' ')}`, 'info');
  };

  // 8. Delete Order
  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderApi(orderId);
    } catch (e) {
      console.warn('Backend delete failed, applying locally', e);
    }

    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Order Deleted', 'The order record has been removed.', 'warning');
  };

  // 9. Daily Closing Report Aggregator
  const getDailyClosingReport = (): DailyClosingReport => {
    const todayStr = new Date().toISOString().split('T')[0];
    let cash = 0;
    let upi = 0;
    let card = 0;
    let bank = 0;
    let completedCount = 0;
    let pendingTotal = 0;

    orders.forEach(order => {
      if (order.dueBalance > 0) {
        pendingTotal += order.dueBalance;
      }
      if (order.status === 'COMPLETED') {
        completedCount++;
      }
      (order.payments || []).forEach(p => {
        if (p.paymentMode === 'Cash') cash += p.amount;
        else if (p.paymentMode === 'GPay / UPI') upi += p.amount;
        else if (p.paymentMode === 'Card') card += p.amount;
        else if (p.paymentMode === 'Bank Transfer') bank += p.amount;
      });
    });

    return {
      date: todayStr,
      totalCollected: cash + upi + card + bank,
      cashCollected: cash,
      upiCollected: upi,
      cardCollected: card,
      bankCollected: bank,
      totalOrdersCompleted: completedCount,
      pendingDuesTotal: pendingTotal
    };
  };

  // Notification helpers
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      customers,
      notifications,
      toasts,
      createOrder,
      markDesignReady,
      forwardToBilling,
      recordPayment,
      updateGstAndInvoice,
      completeOrder,
      reassignDesigner,
      deleteOrder,
      updateOrderStatus,
      getDailyClosingReport,
      markNotificationAsRead,
      clearAllNotifications,
      dismissToast,
      showToast
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
