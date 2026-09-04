import React from 'react';
import { Order, OrderStatus } from '../types';
import { 
  Palette, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  User, 
  Phone,
  Printer,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onSelect: (order: Order) => void;
  onActionClick?: (order: Order, e: React.MouseEvent) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onSelect, onActionClick }) => {
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ASSIGNED_TO_DESIGNER':
        return {
          label: 'With Designer',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: Palette
        };
      case 'DESIGN_READY':
        return {
          label: '🌟 READY FOR REVIEW',
          bg: 'bg-red-500/20 text-red-400 border-red-500/80 shadow-lg shadow-red-900/50 animate-pulse',
          icon: Sparkles
        };
      case 'FORWARDED_TO_BILLING':
        return {
          label: 'At Billing & Print Desk',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: Printer
        };
      case 'COMPLETED':
        return {
          label: 'Completed & Billed',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  const isDesignReady = order.status === 'DESIGN_READY';

  return (
    <div 
      onClick={() => onSelect(order)}
      className={`glass-card rounded-2xl p-4 sm:p-5 cursor-pointer relative group transition-all duration-200 ${
        isDesignReady ? 'ring-2 ring-red-500/80 bg-red-950/10' : ''
      }`}
    >
      {/* Top Row: Job No & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-slate-300 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80">
            {order.jobNo}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {order.category}
          </span>
        </div>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span>{statusInfo.label}</span>
        </span>
      </div>

      {/* Title & Customer */}
      <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
        {order.title}
      </h3>
      
      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-medium text-slate-300 truncate">{order.customerName}</span>
        <span>•</span>
        <Phone className="w-3 h-3 text-slate-500" />
        <span>{order.customerPhone}</span>
      </div>

      {/* Specifications Snippet */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
        {order.flexSpecs && (
          <div className="flex items-center justify-between font-mono">
            <span>Size: {order.flexSpecs.widthFt}×{order.flexSpecs.heightFt} ft ({order.flexSpecs.sqFt} sqft)</span>
            <span className="text-amber-400">{order.flexSpecs.finishType}</span>
          </div>
        )}
        {order.invitationSpecs && (
          <div className="flex items-center justify-between">
            <span>Qty: {order.invitationSpecs.quantity} Cards</span>
            <span className="text-red-400">{order.invitationSpecs.paperType}</span>
          </div>
        )}
        {order.noticeSpecs && (
          <div className="flex items-center justify-between">
            <span>{order.noticeSpecs.size} - Qty: {order.noticeSpecs.quantity}</span>
            <span className="text-emerald-400">{order.noticeSpecs.printType}</span>
          </div>
        )}
        {order.generalSpecs && (
          <div className="flex items-center justify-between">
            <span>Item: {order.generalSpecs.itemType}</span>
            <span className="text-purple-400">Qty: {order.generalSpecs.quantity}</span>
          </div>
        )}
      </div>

      {/* Preview Thumbnail if Ready */}
      {order.designFileUrl && (
        <div className="mt-3 relative rounded-xl overflow-hidden h-24 border border-slate-700/60 group-hover:border-red-500/40 transition-colors">
          <img 
            src={order.designFileUrl} 
            alt={order.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          <span className="absolute bottom-2 left-2 text-[10px] font-medium text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Proof Attached</span>
          </span>
        </div>
      )}

      {/* Bottom Row: Designer & Financials */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400 truncate max-w-[120px] sm:max-w-[150px]">
            {order.designerName.split(' ')[0]}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400">Total / Due</span>
          <div className="flex items-center space-x-1 font-mono font-bold">
            <span className="text-white">₹{order.totalAmount}</span>
            {order.dueBalance > 0 ? (
              <span className="text-red-400 text-[11px]"> (Due ₹{order.dueBalance})</span>
            ) : (
              <span className="text-emerald-400 text-[10px]"> (Paid)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
