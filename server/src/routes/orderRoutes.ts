import { Router, Response } from 'express';
import { db } from '../mockDatabase';
import { AuthRequest, authenticateJWT } from './authRoutes';
import { OrderStatus, PaymentMode } from '../types';
import { io } from '../socket';

export const orderRouter = Router();

// GET All Orders
orderRouter.get('/', (req: AuthRequest, res: Response) => {
  const orders = db.getOrders();
  return res.json({ success: true, orders });
});

// GET Single Order
orderRouter.get('/:id', (req: AuthRequest, res: Response) => {
  const orderId = req.params.id as string;
  const order = db.getOrderById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  return res.json({ success: true, order });
});

// POST Create Order (Admin)
orderRouter.post('/', authenticateJWT, (req: AuthRequest, res: Response) => {
  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'Admin', role: 'ADMIN' };
  const newOrder = db.createOrder(req.body, currentUser as any);

  // Notify Designer
  const notif = db.createNotification({
    orderId: newOrder.id,
    jobNo: newOrder.jobNo,
    title: '📌 New Design Job Assigned!',
    message: `New order "${newOrder.title}" assigned by ${currentUser.name}.`,
    type: 'ASSIGNED',
    roleTarget: 'DESIGNER'
  });

  // Emit Socket.io real-time event to all desks
  io.emit('order:created', { order: newOrder, notification: notif });

  return res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
});

// PUT / PATCH Update Order Status & Workflow Progress
const handleUpdateStatus = (req: AuthRequest, res: Response) => {
  const { status, notes, proofUrl, proofName, assignedDesignerId, assignedDesigner } = req.body as {
    status?: OrderStatus;
    notes?: string;
    proofUrl?: string;
    proofName?: string;
    assignedDesignerId?: string;
    assignedDesigner?: string;
  };

  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'User', role: 'ADMIN' };

  const updates: any = {};
  if (status) updates.status = status;
  if (proofUrl) updates.proofUrl = proofUrl;
  if (proofName) updates.proofName = proofName;
  if (assignedDesignerId) updates.designerId = assignedDesignerId;
  if (assignedDesigner) updates.designerName = assignedDesigner;

  const updatedOrder = db.updateOrder(req.params.id as string, updates, currentUser as any, notes);
  if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });

  // Generate role notification based on status
  let notif;
  if (status === 'DESIGN_READY') {
    notif = db.createNotification({
      orderId: updatedOrder.id,
      jobNo: updatedOrder.jobNo,
      title: '✨ Design Proof Uploaded!',
      message: `${currentUser.name} uploaded proof for ${updatedOrder.title}. Ready for Admin Review!`,
      type: 'DESIGN_READY',
      roleTarget: 'ADMIN'
    });
  } else if (status === 'PRINTING_IN_PROGRESS') {
    notif = db.createNotification({
      orderId: updatedOrder.id,
      jobNo: updatedOrder.jobNo,
      title: '🖨️ Printing Started',
      message: `Job ${updatedOrder.jobNo} is now printing in Press Room.`,
      type: 'PRINTING_STARTED',
      roleTarget: 'ADMIN'
    });
  } else if (status === 'FORWARDED_TO_BILLING') {
    notif = db.createNotification({
      orderId: updatedOrder.id,
      jobNo: updatedOrder.jobNo,
      title: '🧾 Forwarded to Billing Desk',
      message: `Job ${updatedOrder.jobNo} is ready for invoicing & final payment collection.`,
      type: 'BILLING_FORWARDED',
      roleTarget: 'BILLING'
    });
  }

  // Emit Socket.io real-time update
  io.emit('order:updated', { order: updatedOrder, notification: notif });

  return res.json({ success: true, message: `Order status updated`, order: updatedOrder });
};

orderRouter.put('/:id/status', authenticateJWT, handleUpdateStatus);
orderRouter.patch('/:id/status', authenticateJWT, handleUpdateStatus);

// PUT / PATCH Record Payment
const handleRecordPayment = (req: AuthRequest, res: Response) => {
  const { amount, advancePaid, paymentMode, transactionRef, notes, note } = req.body as {
    amount?: number;
    advancePaid?: number;
    paymentMode: PaymentMode;
    transactionRef?: string;
    notes?: string;
    note?: string;
  };

  const paymentAmount = amount || advancePaid || 0;

  const orderId = req.params.id as string;
  const order = db.getOrderById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'User', role: 'BILLING' };
  const now = new Date().toISOString();

  const newPayment = {
    id: 'pay-' + Date.now(),
    orderId: order.id,
    jobNo: order.jobNo,
    amount: paymentAmount,
    paymentMode,
    transactionRef,
    receivedBy: currentUser.name,
    createdAt: now,
    notes: notes || note
  };

  const updatedPayments = [...(order.payments || []), newPayment];
  const newAdvance = order.advancePaid + paymentAmount;
  const newDue = Math.max(0, order.totalAmount - newAdvance);
  const isComplete = newDue === 0;

  const updatedOrder = db.updateOrder(
    order.id,
    {
      advancePaid: newAdvance,
      dueBalance: newDue,
      paymentMethod: paymentMode,
      payments: updatedPayments,
      status: isComplete ? 'COMPLETED' : order.status
    },
    currentUser as any,
    `Received payment of ₹${paymentAmount} via ${paymentMode}. Balance due: ₹${newDue}.`
  );

  const notif = db.createNotification({
    orderId: order.id,
    jobNo: order.jobNo,
    title: '💰 Payment Recorded!',
    message: `₹${paymentAmount} collected for ${order.jobNo} via ${paymentMode}.`,
    type: 'PAYMENT_RECEIVED',
    roleTarget: 'ADMIN'
  });

  io.emit('order:updated', { order: updatedOrder, notification: notif });

  return res.json({ success: true, message: 'Payment recorded successfully', order: updatedOrder });
};

orderRouter.put('/:id/payment', authenticateJWT, handleRecordPayment);
orderRouter.patch('/:id/payment', authenticateJWT, handleRecordPayment);

// PUT / PATCH Reassign Designer
const handleReassign = (req: AuthRequest, res: Response) => {
  const { designerId, designerName } = req.body;
  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'Admin', role: 'ADMIN' };

  const updatedOrder = db.updateOrder(
    req.params.id as string,
    { designerId, designerName, status: 'ASSIGNED_TO_DESIGNER' },
    currentUser as any,
    `Reassigned to ${designerName}`
  );

  if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });

  io.emit('order:updated', { order: updatedOrder });

  return res.json({ success: true, message: `Reassigned to ${designerName}`, order: updatedOrder });
};

orderRouter.put('/:id/reassign', authenticateJWT, handleReassign);
orderRouter.patch('/:id/reassign', authenticateJWT, handleReassign);

// POST / PUT / PATCH Direct Message / Instruction to Designer
const handleSendMessage = (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'Admin', role: 'ADMIN' };
  const orderId = req.params.id as string;
  const order = db.getOrderById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const updatedOrder = db.updateOrder(
    req.params.id as string,
    {},
    currentUser as any,
    `💬 ${currentUser.name}: ${message.trim()}`
  );

  const notif = db.createNotification({
    orderId: order.id,
    jobNo: order.jobNo,
    title: `💬 Admin Message on ${order.jobNo}`,
    message: `${currentUser.name}: "${message.trim()}"`,
    type: 'ASSIGNED',
    roleTarget: 'DESIGNER'
  });

  io.emit('order:updated', { order: updatedOrder, notification: notif });
  io.emit('designer_message_received', {
    id: 'msg-' + Date.now(),
    orderId: order.id,
    jobNo: order.jobNo,
    designerId: order.designerId,
    designerName: order.designerName,
    senderName: currentUser.name,
    message: message.trim(),
    timestamp: new Date().toISOString()
  });

  return res.json({ success: true, message: 'Message sent to designer', order: updatedOrder });
};

orderRouter.post('/:id/message', authenticateJWT, handleSendMessage);
orderRouter.put('/:id/message', authenticateJWT, handleSendMessage);
orderRouter.patch('/:id/message', authenticateJWT, handleSendMessage);

// DELETE Order
orderRouter.delete('/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteOrder(id);
  if (!success) return res.status(404).json({ success: false, message: 'Order not found' });

  io.emit('order:deleted', { id });

  return res.json({ success: true, message: 'Order deleted successfully' });
});
