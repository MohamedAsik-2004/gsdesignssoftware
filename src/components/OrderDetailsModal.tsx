import React, { useState } from 'react';
import { Order, PaymentMode } from '../types';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Sparkles, 
  Palette, 
  Printer, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Upload, 
  FileText, 
  User, 
  Phone, 
  DollarSign,
  ArrowRight,
  Trash2,
  ExternalLink,
  MessageSquare,
  IndianRupee,
  Receipt
} from 'lucide-react';
import { PrintableInvoiceModal } from './PrintableInvoiceModal';
import { WhatsAppShareModal } from './WhatsAppShareModal';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { currentUser, users } = useAuth();
  const { markDesignReady, forwardToBilling, completeOrder, deleteOrder, recordPayment } = useOrders();

  const [proofUrl, setProofUrl] = useState('');
  const [designerNotesInput, setDesignerNotesInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Payment Recording State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<PaymentMode>('GPay / UPI');
  const [payRef, setPayRef] = useState('');

  if (!order) return null;

  const isDesigner = currentUser.role === 'DESIGNER';
  const isAdmin = currentUser.role === 'ADMIN';
  const isBilling = currentUser.role === 'BILLING';

  const designers = users.filter(u => u.role === 'DESIGNER');

  const handleDesignerMarkReady = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProofUrl = proofUrl.trim() || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800';
    markDesignReady(order.id, finalProofUrl, 'Design_Proof_Final.png', designerNotesInput);
  };

  const handleAdminForwardToBilling = () => {
    forwardToBilling(order.id, adminNotesInput);
  };

  const handleCompleteOrder = () => {
    completeOrder(order.id);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    recordPayment(order.id, payAmount, payMode, payRef);
    setShowPaymentForm(false);
    setPayAmount(0);
    setPayRef('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-slide-up my-8 text-slate-100">
        
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-sm font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-xl border border-red-500/30">
                {order.jobNo}
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                {order.category}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{order.title}</h2>
          </div>

          <div className="flex items-center space-x-2">
            {/* Instant WhatsApp Share Button */}
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Customer</span>
            </button>

            {/* Instant Printable Invoice Button */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Customer Specs & Proof Preview */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Customer Info Box */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer</span>
                  <p className="font-bold text-slate-100">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                  <p className="font-mono text-slate-200">{order.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Assigned Designer</span>
                  <p className="font-medium text-amber-400">{order.designerName}</p>
                </div>
              </div>

              {/* Specs Breakdown Box */}
              <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Specifications</h4>
                
                {order.description && (
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    <span className="font-semibold text-red-400">Notes/Text: </span>
                    {order.description}
                  </p>
                )}

                {order.flexSpecs && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Dimensions</span>
                      <span className="font-mono font-bold text-white">{order.flexSpecs.widthFt} × {order.flexSpecs.heightFt} Feet</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Area</span>
                      <span className="font-mono font-bold text-amber-400">{order.flexSpecs.sqFt} Sq.Ft</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Material</span>
                      <span className="font-bold text-slate-200">{order.flexSpecs.finishType}</span>
                    </div>
                  </div>
                )}

                {order.invitationSpecs && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Quantity</span>
                      <span className="font-mono font-bold text-white">{order.invitationSpecs.quantity} Cards</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Paper Type</span>
                      <span className="font-bold text-red-400">{order.invitationSpecs.paperType}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs">
                      <span className="text-slate-400 block text-[10px]">Print Finish</span>
                      <span className="font-bold text-slate-200">{order.invitationSpecs.printType}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Design Proof Section */}
              {order.designFileUrl ? (
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Design Proof / Mockup Attached</span>
                    </h4>
                    {order.designerCompletedAt && (
                      <span className="text-[10px] text-slate-400">
                        Uploaded {new Date(order.designerCompletedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-72">
                    <img 
                      src={order.designFileUrl} 
                      alt="Design proof" 
                      className="w-full h-full object-cover" 
                    />
                    <a 
                      href={order.designFileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold flex items-center space-x-1 backdrop-blur-md border border-slate-700 shadow-lg"
                    >
                      <span>Full View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {order.designerNotes && (
                    <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-xl">
                      "{order.designerNotes}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/40 rounded-2xl p-6 border border-dashed border-slate-800 text-center space-y-2">
                  <Palette className="w-8 h-8 text-amber-500/60 mx-auto" />
                  <p className="text-xs font-medium text-slate-400">Design proof has not been uploaded yet.</p>
                </div>
              )}

              {/* ACTION PANEL FOR DESIGNER: Upload & Mark Ready */}
              {isDesigner && (order.status === 'ASSIGNED_TO_DESIGNER' || order.status === 'DESIGN_IN_PROGRESS') && (
                <form onSubmit={handleDesignerMarkReady} className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/50 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                    <h4 className="text-sm font-extrabold text-white">Designer Action: Upload Proof & Mark "Ready"</h4>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Proof Image URL / Attachment Link</label>
                    <input 
                      type="url"
                      placeholder="Paste image URL (e.g. https://... or leave empty for sample proof)"
                      value={proofUrl}
                      onChange={e => setProofUrl(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Designer Notes for Admin</label>
                    <input 
                      type="text"
                      placeholder="e.g. Tamil fonts formatted, high res vector proof ready"
                      value={designerNotesInput}
                      onChange={e => setDesignerNotesInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-900/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>MARK DESIGN "READY" & ALERT ADMIN</span>
                  </button>
                </form>
              )}

              {/* ACTION PANEL FOR ADMIN: Approve & Forward to Billing */}
              {isAdmin && order.status === 'DESIGN_READY' && (
                <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-red-500/80 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-red-400" />
                    <h4 className="text-sm font-extrabold text-white">Admin Action: Review & Forward to Billing Desk</h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Designer has finished the proof. Click below to route this job to the Billing & Printing department.
                  </p>

                  <input 
                    type="text"
                    placeholder="Optional Admin note for Billing..."
                    value={adminNotesInput}
                    onChange={e => setAdminNotesInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  />

                  <button
                    onClick={handleAdminForwardToBilling}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-900/50 transition-all flex items-center justify-center space-x-2"
                  >
                    <Printer className="w-5 h-5" />
                    <span>APPROVE & FORWARD TO BILLING</span>
                  </button>
                </div>
              )}

              {/* ACTION PANEL FOR BILLING: Generate Invoice & Print */}
              {isBilling && order.status === 'FORWARDED_TO_BILLING' && (
                <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-emerald-500/80 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Printer className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-extrabold text-white">Billing Action: Finalize Invoice & Print</h4>
                  </div>

                  <button
                    onClick={handleCompleteOrder}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/50 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>GENERATE INVOICE & MARK COMPLETED</span>
                  </button>
                </div>
              )}

            </div>

            {/* Right 1 Col: Financial Breakdown, Payment Recorder & Audit Log */}
            <div className="space-y-5">
              
              {/* Financial Box */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Breakdown</h4>
                  <button
                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{showPaymentForm ? 'Cancel' : '+ Record Payment'}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Total Bill:</span>
                    <span className="font-mono font-bold text-white">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Advance Paid:</span>
                    <span className="font-mono font-bold">₹{order.advancePaid}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-red-400">
                    <span>Balance Due:</span>
                    <span className="font-mono">₹{order.dueBalance}</span>
                  </div>
                </div>

                {/* Record Payment Inline Form */}
                {showPaymentForm && (
                  <form onSubmit={handleAddPayment} className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Amount Received (₹)</label>
                      <input 
                        type="number"
                        min="1"
                        max={order.dueBalance || order.totalAmount}
                        value={payAmount || ''}
                        onChange={e => setPayAmount(Number(e.target.value))}
                        placeholder={`Max ₹${order.dueBalance}`}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Payment Method</label>
                      <select 
                        value={payMode}
                        onChange={e => setPayMode(e.target.value as PaymentMode)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="Cash">Cash</option>
                        <option value="GPay / UPI">GPay / PhonePe / UPI</option>
                        <option value="Card">Debit / Credit Card</option>
                        <option value="Bank Transfer">Bank NetBanking</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-all mt-1"
                    >
                      Confirm Payment Entry
                    </button>
                  </form>
                )}

                {/* Payment Transactions History */}
                {order.payments && order.payments.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Receipts</span>
                    {order.payments.map(p => (
                      <div key={p.id} className="text-[11px] bg-slate-950/60 p-2 rounded-lg flex justify-between items-center text-slate-300">
                        <div>
                          <span className="font-semibold">{p.paymentMode}</span>
                          <span className="text-[10px] text-slate-500 block">{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">+₹{p.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Audit Timeline Logs */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Workflow Audit Log</span>
                </h4>
                
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {order.timeline.map((item) => (
                    <div key={item.id} className="relative pl-6 text-xs space-y-0.5">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-red-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      </div>
                      <p className="font-semibold text-slate-200">{item.status.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.updatedBy} ({item.role}) • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-1.5 rounded mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Safety Deletion */}
              {isAdmin && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete order ${order.jobNo}?`)) {
                        deleteOrder(order.id);
                        onClose();
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Order Record</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Printable Tax & POS Receipt Modal */}
        {showPrintModal && (
          <PrintableInvoiceModal 
            order={order} 
            onClose={() => setShowPrintModal(false)} 
          />
        )}

        {/* WhatsApp Direct Share Modal */}
        {showWhatsAppModal && (
          <WhatsAppShareModal 
            order={order} 
            onClose={() => setShowWhatsAppModal(false)} 
          />
        )}

      </div>
    </div>
  );
};
