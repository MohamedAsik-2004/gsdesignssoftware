import React from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { orders, customers } = useOrders();
  const { users } = useAuth();

  const designers = users.filter(u => u.role === 'DESIGNER');

  // Revenue metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalAdvance = orders.reduce((acc, o) => acc + o.advancePaid, 0);
  const totalDues = orders.reduce((acc, o) => acc + o.dueBalance, 0);

  // Category statistics
  const categoryStats: Record<string, { count: number; revenue: number; sqft?: number; cards?: number; quantity?: number }> = {
    FLEX: { count: 0, revenue: 0, sqft: 0 },
    INVITATION: { count: 0, revenue: 0, cards: 0 },
    NOTICE: { count: 0, revenue: 0, quantity: 0 },
    LOGO: { count: 0, revenue: 0 },
    SHIELD_MEMENTO: { count: 0, revenue: 0 },
    GENERAL: { count: 0, revenue: 0 },
    OTHER: { count: 0, revenue: 0 }
  };

  orders.forEach(o => {
    const cat = o.category || 'OTHER';
    if (categoryStats[cat]) {
      categoryStats[cat].count += 1;
      categoryStats[cat].revenue += o.totalAmount;

      if (cat === 'FLEX' && o.flexSpecs) {
        categoryStats.FLEX.sqft = (categoryStats.FLEX.sqft || 0) + (o.flexSpecs.sqFt || o.flexSpecs.widthFt * o.flexSpecs.heightFt);
      } else if (cat === 'INVITATION' && o.invitationSpecs) {
        categoryStats.INVITATION.cards = (categoryStats.INVITATION.cards || 0) + o.invitationSpecs.quantity;
      } else if (cat === 'NOTICE' && o.noticeSpecs) {
        categoryStats.NOTICE.quantity = (categoryStats.NOTICE.quantity || 0) + o.noticeSpecs.quantity;
      }
    }
  });

  // Designer performance breakdown
  const designerPerformance = designers.map(d => {
    const assignedOrders = orders.filter(o => o.designerId === d.id);
    const completedOrders = assignedOrders.filter(o => o.status === 'COMPLETED' || o.status === 'FORWARDED_TO_BILLING' || o.status === 'PRINT_READY');
    const totalDesignValue = assignedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const completionRate = assignedOrders.length > 0 ? Math.round((completedOrders.length / assignedOrders.length) * 100) : 100;

    return {
      designer: d,
      assignedCount: assignedOrders.length,
      completedCount: completedOrders.length,
      revenue: totalDesignValue,
      completionRate
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Shop & Designer Performance Analytics</h2>
            <p className="text-xs text-slate-400">GS Designs Real-Time Revenue Breakdown & Turnaround Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Total Customers:</span>
            <span className="text-sm font-bold text-white">{customers.length} Accounts</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Total Orders Processed:</span>
            <span className="text-sm font-bold text-emerald-400">{orders.length} Jobs</span>
          </div>
        </div>
      </div>

      {/* High Level Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Business Volume</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <div className="mt-2 flex items-center space-x-1 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>₹{totalAdvance.toLocaleString('en-IN')} Cash/UPI Received</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Customer Dues</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-red-400">₹{totalDues.toLocaleString('en-IN')}</p>
          <div className="mt-2 text-[11px] text-slate-400">
            Pending collection upon pickup
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Flex Printed Volume</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-400">{categoryStats.FLEX.sqft} <span className="text-sm font-sans font-medium text-slate-300">Sq.Ft</span></p>
          <div className="mt-2 text-[11px] text-slate-400">
            Star Flex & High-Res Banner Output
          </div>
        </div>

      </div>

      {/* Designer Performance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Designer Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Designer Performance Leaderboard</h3>
            </div>
            <span className="text-xs text-slate-400">{designers.length} Active Designers</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {designerPerformance.map(dp => (
              <div key={dp.designer.id} className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <img 
                    src={dp.designer.avatar} 
                    alt={dp.designer.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{dp.designer.name}</h4>
                    <p className="text-xs text-slate-400">{dp.designer.designation || 'Graphic Designer'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <span className="text-xs text-slate-400 block">Assigned / Done</span>
                    <span className="text-xs font-bold text-white font-mono">{dp.completedCount} / {dp.assignedCount} Jobs</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Completion</span>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">{dp.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Design Value</span>
                    <span className="text-sm font-black text-amber-400 font-mono">₹{dp.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <PieChartIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Service Category Revenue</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 block">Flex Banners</span>
                <span className="text-[11px] text-slate-400">{categoryStats.FLEX.count} Jobs ({categoryStats.FLEX.sqft} SqFt)</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">₹{categoryStats.FLEX.revenue.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-red-400 block">Invitation Cards</span>
                <span className="text-[11px] text-slate-400">{categoryStats.INVITATION.count} Jobs ({categoryStats.INVITATION.cards} Cards)</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">₹{categoryStats.INVITATION.revenue.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Notice & Pamphlet</span>
                <span className="text-[11px] text-slate-400">{categoryStats.NOTICE.count} Jobs ({categoryStats.NOTICE.quantity} Flyers)</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">₹{categoryStats.NOTICE.revenue.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-blue-400 block">Logo & Branding</span>
                <span className="text-[11px] text-slate-400">{categoryStats.LOGO.count} Packages</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">₹{categoryStats.LOGO.revenue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
