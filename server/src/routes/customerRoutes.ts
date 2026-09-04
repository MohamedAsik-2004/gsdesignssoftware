import { Router, Response } from 'express';
import { db } from '../mockDatabase';

export const customerRouter = Router();

// GET Customer List & Dues
customerRouter.get('/', (req, res: Response) => {
  return res.json({ success: true, customers: db.getCustomers() });
});

// GET Daily Closing Report Aggregator
export const reportRouter = Router();

reportRouter.get('/daily-closing', (req, res: Response) => {
  const todayStr = new Date().toISOString().split('T')[0];
  let cash = 0;
  let upi = 0;
  let card = 0;
  let bank = 0;
  let completedCount = 0;
  let pendingTotal = 0;

  const orders = db.getOrders();
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

  return res.json({
    success: true,
    report: {
      date: todayStr,
      totalCollected: cash + upi + card + bank,
      cashCollected: cash,
      upiCollected: upi,
      cardCollected: card,
      bankCollected: bank,
      totalOrdersCompleted: completedCount,
      pendingDuesTotal: pendingTotal
    }
  });
});
