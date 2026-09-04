import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { Printer, CheckCircle2, DollarSign, FileText, CreditCard, Sparkles } from 'lucide-react';

export const BillingWorkspace: React.FC = () => {
  const { orders, completeOrder } = useOrders();
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pendingBillingQueue = orders.filter(o => o.status === 'FORWARDED_TO_BILLING');
  const completedBillingQueue = orders.filter(o => o.status === 'COMPLETED');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-lg" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                Billing & Printing Desk
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">Billing & Invoice Operations</h2>
            <p className="text-xs text-slate-400">
              Orders forwarded by Admin ready for invoice generation and print execution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Pending Bills</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{pendingBillingQueue.length} Orders</span>
          </div>
        </div>
      </div>

      {/* Pending Invoices Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Orders Forwarded for Invoicing ({pendingBillingQueue.length})</span>
          </h3>
        </div>

        {pendingBillingQueue.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
            <h4 className="text-base font-bold text-slate-200">No Pending Billing Orders</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When Admin approves designer proofs and forwards them, they will appear here for payment settlement and printing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingBillingQueue.map(o => (
              <OrderCard 
                key={o.id} 
                order={o} 
                onSelect={setSelectedOrder} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed Bills */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Recently Billed & Completed</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {completedBillingQueue.map(o => (
            <OrderCard 
              key={o.id} 
              order={o} 
              onSelect={setSelectedOrder} 
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

    </div>
  );
};
