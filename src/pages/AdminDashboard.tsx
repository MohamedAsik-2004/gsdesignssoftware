import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Order, OrderCategory, OrderStatus } from '../types';
import { OrderCard } from '../components/OrderCard';
import { CreateOrderModal } from '../components/CreateOrderModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Palette, 
  Printer, 
  DollarSign,
  Layers,
  Flame
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Metrics
  const totalOrders = orders.length;
  const readyCount = orders.filter(o => o.status === 'DESIGN_READY').length;
  const inDesignCount = orders.filter(o => o.status === 'ASSIGNED_TO_DESIGNER' || o.status === 'DESIGN_IN_PROGRESS').length;
  const printingCount = orders.filter(o => o.status === 'PRINTING_IN_PROGRESS' || o.status === 'PRINT_READY').length;
  const billingCount = orders.filter(o => o.status === 'FORWARDED_TO_BILLING' || o.status === 'BILLED_PRINTING').length;
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalAdvance = orders.reduce((sum, o) => sum + o.advancePaid, 0);
  const totalDue = orders.reduce((sum, o) => sum + o.dueBalance, 0);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.jobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || o.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getOrdersByStatus = (status: OrderStatus) => {
    return filteredOrders.filter(o => o.status === status);
  };

  const getPrintingOrders = () => {
    return filteredOrders.filter(o => o.status === 'PRINTING_IN_PROGRESS' || o.status === 'PRINT_READY');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/60 p-6 rounded-3xl border-2 border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              Admin & Owner Dispatch Center
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-2">Order Dispatch & Live Kanban</h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Monitor real-time design readiness, route orders to billing/printing, and track shop revenue.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm shadow-xl shadow-red-900/50 transition-all flex items-center justify-center space-x-2.5 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>New Customer Order</span>
        </button>
      </div>

      {/* Metrics Row - Ultra Legible High-Contrast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Orders */}
        <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2 font-mono">{totalOrders}</p>
          <span className="text-xs text-slate-400 font-medium">Active shop volume</span>
        </div>

        {/* Design In Progress */}
        <div className="bg-slate-900 p-4 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 shadow-md">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>With Designer</span>
            <Palette className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-2 font-mono">{inDesignCount}</p>
          <span className="text-xs text-amber-200/80 font-semibold">Assigned to graphic team</span>
        </div>

        {/* Ready for Review */}
        <div className={`p-4 rounded-2xl border-2 transition-all shadow-md ${
          readyCount > 0 
            ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/60' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-red-400 text-xs font-black uppercase tracking-wider">
            <span>READY FOR REVIEW</span>
            <Sparkles className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400 mt-2 font-mono">{readyCount}</p>
          <span className="text-xs text-red-200 font-bold">Requires Admin Action!</span>
        </div>

        {/* Printing Machine */}
        <div className="bg-slate-900 p-4 rounded-2xl border-2 border-amber-600/40 bg-amber-600/10 shadow-md">
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>Press Room</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-300 mt-2 font-mono">{printingCount}</p>
          <span className="text-xs text-amber-200/80 font-semibold">Printing in machine</span>
        </div>

        {/* Total Revenue & Pending Due */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900 p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 shadow-md">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2 font-mono">₹{totalRevenue}</p>
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mt-1">
            <span>Collected: ₹{totalAdvance}</span>
            <span className="text-red-400 font-bold">Due: ₹{totalDue}</span>
          </div>
        </div>

      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Job #, Customer, Title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white font-medium placeholder-slate-400 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'FLEX', 'INVITATION', 'NOTICE', 'LOGO', 'SHIELD_MEMENTO'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {cat === 'SHIELD_MEMENTO' ? 'Shields' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* KANBAN WORKFLOW BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Column 1: Assigned to Designer */}
        <div className="bg-slate-900 rounded-3xl p-4 border-2 border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-extrabold text-base text-white">With Designer</h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-black border border-amber-500/30">
              {getOrdersByStatus('ASSIGNED_TO_DESIGNER').length}
            </span>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {getOrdersByStatus('ASSIGNED_TO_DESIGNER').length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium italic">
                No orders currently with designer.
              </div>
            ) : (
              getOrdersByStatus('ASSIGNED_TO_DESIGNER').map(o => (
                <OrderCard key={o.id} order={o} onSelect={setSelectedOrder} />
              ))
            )}
          </div>
        </div>

        {/* Column 2: DESIGN READY (ACTION REQUIRED BY ADMIN!) */}
        <div className="bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 rounded-3xl p-4 border-2 border-red-500/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-red-500/40">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h3 className="font-extrabold text-base text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span>Ready for Review</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-mono font-black shadow">
              {getOrdersByStatus('DESIGN_READY').length}
            </span>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {getOrdersByStatus('DESIGN_READY').length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium italic">
                No pending design reviews.
              </div>
            ) : (
              getOrdersByStatus('DESIGN_READY').map(o => (
                <OrderCard key={o.id} order={o} onSelect={setSelectedOrder} />
              ))
            )}
          </div>
        </div>

        {/* Column 3: In Press Room / Printing */}
        <div className="bg-slate-900 rounded-3xl p-4 border-2 border-amber-600/30 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-extrabold text-base text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>In Press Room</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-black border border-amber-500/30">
              {getPrintingOrders().length}
            </span>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {getPrintingOrders().length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium italic">
                No orders currently in press room.
              </div>
            ) : (
              getPrintingOrders().map(o => (
                <OrderCard key={o.id} order={o} onSelect={setSelectedOrder} />
              ))
            )}
          </div>
        </div>

        {/* Column 4: Billing Desk & Completed */}
        <div className="bg-slate-900 rounded-3xl p-4 border-2 border-emerald-600/30 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-base text-white">Billing & Completed</h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/30">
              {getOrdersByStatus('FORWARDED_TO_BILLING').length + getOrdersByStatus('COMPLETED').length}
            </span>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {getOrdersByStatus('FORWARDED_TO_BILLING').length === 0 && getOrdersByStatus('COMPLETED').length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium italic">
                No orders at billing desk.
              </div>
            ) : (
              [...getOrdersByStatus('FORWARDED_TO_BILLING'), ...getOrdersByStatus('COMPLETED')].map(o => (
                <OrderCard key={o.id} order={o} onSelect={setSelectedOrder} />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <CreateOrderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

    </div>
  );
};
