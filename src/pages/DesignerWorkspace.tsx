import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { Palette, CheckCircle2, Clock, Sparkles, Filter, Layers } from 'lucide-react';

export const DesignerWorkspace: React.FC = () => {
  const { orders } = useOrders();
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');

  // Filter orders assigned to current logged in designer (or all assigned if admin is viewing designer desk)
  const designerOrders = orders.filter(o => 
    currentUser.role === 'ADMIN' ? true : o.designerId === currentUser.id
  );

  const pendingQueue = designerOrders.filter(o => 
    o.status === 'ASSIGNED_TO_DESIGNER' || o.status === 'DESIGN_IN_PROGRESS'
  );

  const completedQueue = designerOrders.filter(o => 
    o.status === 'DESIGN_READY' || o.status === 'FORWARDED_TO_BILLING' || o.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-lg" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
                Graphic Designer Desk
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">{currentUser.name} Workspace</h2>
            <p className="text-xs text-slate-400">
              High-focus queue. Click any job sheet to view specs, attach proof, and click <span className="text-amber-400 font-bold font-mono">Ready</span>.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'PENDING'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Assigned Jobs ({pendingQueue.length})</span>
          </button>
          <button
            onClick={() => setTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'COMPLETED'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed Proofs ({completedQueue.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {tab === 'PENDING' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Jobs Awaiting Design Proof ({pendingQueue.length})</span>
            </h3>
            <span className="text-xs text-slate-500">
              Click any order card to upload design preview & notify Admin
            </span>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
              <h4 className="text-base font-bold text-slate-200">Queue Clean! All designs submitted.</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No pending design jobs assigned to you right now. Stand by for new customer orders from Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingQueue.map(o => (
                <OrderCard 
                  key={o.id} 
                  order={o} 
                  onSelect={setSelectedOrder} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Submitted & Approved Proofs</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedQueue.map(o => (
              <OrderCard 
                key={o.id} 
                order={o} 
                onSelect={setSelectedOrder} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

    </div>
  );
};
