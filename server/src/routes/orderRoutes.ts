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
  const order = db.getOrderById(req.params.id);
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

// PUT Update Order Status & Workflow Progress
orderRouter.put('/:id/status', authenticateJWT, (req: AuthRequest, res: Response) => {
  const { status, notes, proofUrl, proofName } = req.body as {
    status: OrderStatus;
    notes?: string;
    proofUrl?: string;
    proofName?: string;
  };

  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'User', role: 'ADMIN' };

  const updates: any = { status };
  if (proofUrl) updates.proofUrl = proofUrl;
  if (proofName) updates.proofName = proofName;

  const updatedOrder = db.updateOrder(req.params.id, updates, currentUser as any, notes);
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

  return res.json({ success: true, message: `Order status updated to ${status}`, order: updatedOrder });
});

// PUT Record Payment
orderRouter.put('/:id/payment', authenticateJWT, (req: AuthRequest, res: Response) => {
  const { amount, paymentMode, transactionRef, notes } = req.body as {
    amount: number;
    paymentMode: PaymentMode;
    transactionRef?: string;
    notes?: string;
  };

  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'User', role: 'BILLING' };
  const now = new Date().toISOString();

  const newPayment = {
    id: 'pay-' + Date.now(),
    orderId: order.id,
    jobNo: order.jobNo,
    amount,
    paymentMode,
    transactionRef,
    receivedBy: currentUser.name,
    createdAt: now,
    notes
  };

  const updatedPayments = [...(order.payments || []), newPayment];
  const newAdvance = order.advancePaid + amount;
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
    `Received payment of ₹${amount} via ${paymentMode}. Balance due: ₹${newDue}.`
  );

  const notif = db.createNotification({
    orderId: order.id,
    jobNo: order.jobNo,
    title: '💰 Payment Recorded!',
    message: `₹${amount} collected for ${order.jobNo} via ${paymentMode}.`,
    type: 'PAYMENT_RECEIVED',
    roleTarget: 'ADMIN'
  });

  io.emit('order:updated', { order: updatedOrder, notification: notif });

  return res.json({ success: true, message: 'Payment recorded successfully', order: updatedOrder });
});

// PUT Reassign Designer
orderRouter.put('/:id/reassign', authenticateJWT, (req: AuthRequest, res: Response) => {
  const { designerId, designerName } = req.body;
  const currentUser = db.getUserById(req.user!.id) || { id: 'u-1', name: 'Admin', role: 'ADMIN' };

  const updatedOrder = db.updateOrder(
    req.params.id,
    { designerId, designerName, status: 'ASSIGNED_TO_DESIGNER' },
    currentUser as any,
    `Reassigned to ${designerName}`
  );

  if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });

  io.emit('order:updated', { order: updatedOrder });

  return res.json({ success: true, message: `Reassigned to ${designerName}`, order: updatedOrder });
});

// DELETE Order
orderRouter.delete('/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const success = db.deleteOrder(req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Order not found' });

  io.emit('order:deleted', { id: req.params.id });

  return res.json({ success: true, message: 'Order deleted successfully' });
});
