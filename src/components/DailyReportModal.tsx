import React from 'react';
import { useOrders } from '../context/OrderContext';
import { 
  X, 
  BarChart3, 
  IndianRupee, 
  Wallet, 
  Smartphone, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  Printer,
  Calendar
} from 'lucide-react';

interface DailyReportModalProps {
  onClose: () => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ onClose }) => {
  const { getDailyClosingReport, orders } = useOrders();
  const report = getDailyClosingReport();

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 print:border-none print:shadow-none print:bg-white print:text-slate-900">
        
        {/* Top Control Bar */}
        <div className="print:hidden bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Daily Cash Register & Revenue Report</h3>
              <p className="text-xs text-slate-400">Date: <span className="text-emerald-400 font-semibold">{report.date}</span> | GS Designs Nagapattinam</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 space-y-6">
          
          {/* Shop Header (Print Visible) */}
          <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4 text-center">
            <h1 className="text-xl font-black text-slate-900">GS DESIGNS - ADVERTISING AGENCY</h1>
            <p className="text-xs text-slate-600">Daily Cash Register Closing Summary — {report.date}</p>
            <p className="text-[10px] text-slate-500">Public Office Road, Nagapattinam | Ph: 98432 19951</p>
          </div>

          {/* Grand Total Revenue Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/60 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Total Money Collected Today</span>
                <h2 className="text-3xl font-black text-white mt-1 flex items-center">
                  <span>₹{report.totalCollected.toLocaleString('en-IN')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Sum of all advances and final invoice settlements</p>
              </div>

              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <IndianRupee className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Breakdown Grid by Payment Method */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Collection Breakdown by Payment Mode:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-amber-400 mb-1">
                  <Wallet className="w-4 h-4" />
                  <span className="font-bold">Cash in Till</span>
                </div>
                <p className="text-lg font-black text-white">₹{report.cashCollected}</p>
                <p className="text-[10px] text-slate-500">Physical Cash</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-bold">GPay / UPI</span>
                </div>
                <p className="text-lg font-black text-white">₹{report.upiCollected}</p>
                <p className="text-[10px] text-slate-500">Digital Wallet</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-blue-400 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-bold">POS Card</span>
                </div>
                <p className="text-lg font-black text-white">₹{report.cardCollected}</p>
                <p className="text-[10px] text-slate-500">Credit/Debit Card</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-purple-400 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="font-bold">Bank Transfer</span>
                </div>
                <p className="text-lg font-black text-white">₹{report.bankCollected}</p>
                <p className="text-[10px] text-slate-500">NEFT / IMPS</p>
              </div>

            </div>
          </div>

          {/* Operational Metrics & Pending Dues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Billed & Completed Jobs</p>
                <p className="text-xl font-black text-white">{report.totalOrdersCompleted} Orders</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className="p-3 bg-red-950 text-red-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Outstanding Dues Ledger</p>
                <p className="text-xl font-black text-red-400">₹{report.pendingDuesTotal}</p>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-500 text-center pt-2">
            Generated automatically by GS Designs POS & Order Management System.
          </p>

        </div>

      </div>
    </div>
  );
};
