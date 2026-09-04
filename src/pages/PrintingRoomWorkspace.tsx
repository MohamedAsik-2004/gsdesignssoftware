import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';
import { Printer, CheckCircle, Search, Eye } from 'lucide-react';
import { OrderDetailsModal } from '../components/OrderDetailsModal';

export const PrintingRoomWorkspace: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter orders that need printing or are in printing
  const printingOrders = orders.filter((o: Order) => 
    (o.status === 'PRINTING_IN_PROGRESS' || o.status === 'DESIGN_READY' || o.status === 'PRINT_READY') &&
    (searchTerm === '' || 
     o.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'ALL' || o.category === categoryFilter)
  );

  const completedPrintOrders = orders.filter((o: Order) => 
    o.status === 'FORWARDED_TO_BILLING' || o.status === 'BILLED_PRINTING' || o.status === 'COMPLETED'
  );

  const handleMarkPrinted = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderStatus(order.id, 'FORWARDED_TO_BILLING', 'Printing Completed in Press Room by Operator. Sent to Billing Desk.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Workspace Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                Press Room Terminal
              </span>
              <h1 className="text-2xl font-black text-white mt-1">Printing Machine & Press Queue</h1>
            </div>
          </div>
          <p className="text-slate-300 text-sm font-medium">
            Monitor incoming design-ready jobs, verify material specs (Flex sq.ft / paper GSM), and update machine print status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-center">
            <span className="text-2xl font-black text-amber-400">{printingOrders.length}</span>
            <p className="text-xs font-bold text-slate-300 uppercase">Jobs in Press</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-center">
            <span className="text-2xl font-black text-emerald-400">{completedPrintOrders.length}</span>
            <p className="text-xs font-bold text-slate-300 uppercase">Printed Today</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Job #, Customer, Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'FLEX', 'INVITATION', 'NOTICE', 'LOGO', 'SHIELD_MEMENTO'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Printing Queue Grid */}
      {printingOrders.length === 0 ? (
        <div className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Printer className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Pending Print Jobs</h3>
          <p className="text-slate-400 text-sm mt-1">All design-approved flexes and invitations have been printed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printingOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-slate-900 border-2 border-amber-500/40 hover:border-amber-400 rounded-xl p-5 shadow-lg space-y-4 cursor-pointer transition-all hover:-translate-y-1"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                    {order.jobNo}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 line-clamp-1">{order.title}</h3>
                  <p className="text-sm font-semibold text-slate-300">{order.customerName}</p>
                </div>
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                  {order.category}
                </span>
              </div>

              {/* Printing Specs High Contrast Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Material & Press Specs:
                </span>
                
                {order.category === 'FLEX' && order.flexSpecs && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block font-medium">Size (Ft):</span>
                      <strong className="text-white text-sm">{order.flexSpecs.widthFt} x {order.flexSpecs.heightFt} ft</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block font-medium">Area:</span>
                      <strong className="text-emerald-400 text-sm">{order.flexSpecs.sqFt} Sq.Ft</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 col-span-2 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Flex Type:</span>
                      <strong className="text-amber-300 font-bold text-xs">{order.flexSpecs.finishType}</strong>
                    </div>
                  </div>
                )}

                {order.category === 'INVITATION' && order.invitationSpecs && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block font-medium">Quantity:</span>
                      <strong className="text-white text-sm">{order.invitationSpecs.quantity} Cards</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block font-medium">Paper:</span>
                      <strong className="text-amber-300 text-xs">{order.invitationSpecs.paperType}</strong>
                    </div>
                  </div>
                )}

                {order.description && (
                  <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    "{order.description}"
                  </p>
                )}
              </div>

              {/* Design File Preview Attachment if available */}
              {order.designFileUrl && (
                <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <img 
                    src={order.designFileUrl} 
                    alt="Proof" 
                    className="w-12 h-12 object-cover rounded border border-slate-700" 
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-emerald-400 block">Print File Ready</span>
                    <span className="text-xs text-slate-300 truncate block">{order.designPreviewName || 'Print_Ready_Proof.png'}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={(e) => handleMarkPrinted(order, e)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Printed & Send to Bill
                </button>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-lg border border-slate-700"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Order Details */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default PrintingRoomWorkspace;
