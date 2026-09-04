import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Customer } from '../types';
import { 
  X, 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  MessageSquare, 
  AlertCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { WhatsAppShareModal } from './WhatsAppShareModal';

interface CustomerDirectoryModalProps {
  onClose: () => void;
}

export const CustomerDirectoryModal: React.FC<CustomerDirectoryModalProps> = ({ onClose }) => {
  const { customers, orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      (cust.gstNo && cust.gstNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPending = filterPendingOnly ? cust.pendingBalance > 0 : true;
    return matchesSearch && matchesPending;
  });

  const customerOrders = selectedCustomer 
    ? orders.filter(o => o.customerPhone === selectedCustomer.phone)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                <span>Customer Directory & Dues Ledger</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">{customers.length} Clients Registered</span>
              </h3>
              <p className="text-xs text-slate-400">Search clients, view order history, and track pending balances</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split View (Customer List Left | Details & History Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Search & Customer List */}
          <div className="w-full md:w-5/12 border-r border-slate-800 p-4 flex flex-col space-y-3 overflow-y-auto">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone or GST..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Filter Toggle */}
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <input
                type="checkbox"
                checked={filterPendingOnly}
                onChange={e => setFilterPendingOnly(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700"
              />
              <span className="font-semibold text-red-400">Show Pending Dues Only</span>
            </label>

            {/* Customer List */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No matching customers found.
                </div>
              ) : (
                filteredCustomers.map(cust => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-red-500 shadow-md'
                          : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-xs">{cust.name}</h4>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{cust.phone}</span>
                          </p>
                        </div>

                        {cust.pendingBalance > 0 ? (
                          <span className="text-[10px] font-black bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-md">
                            Due ₹{cust.pendingBalance}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            Clean
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex justify-between text-[10px] text-slate-400">
                        <span>Orders: <strong className="text-slate-200">{cust.totalOrdersCount}</strong></span>
                        <span>Total Spent: <strong className="text-slate-200">₹{cust.totalSpent}</strong></span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Customer Details & Past Orders */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/40">
            {selectedCustomer ? (
              <div className="space-y-6">
                
                {/* Customer Banner Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white">{selectedCustomer.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <strong className="text-slate-200">{selectedCustomer.phone}</strong>
                        </span>
                        {selectedCustomer.email && (
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                            <span>{selectedCustomer.email}</span>
                          </span>
                        )}
                        {selectedCustomer.address && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            <span>{selectedCustomer.address}</span>
                          </span>
                        )}
                      </div>

                      {selectedCustomer.gstNo && (
                        <p className="mt-2 text-xs font-semibold text-slate-300">
                          GSTIN: <span className="text-amber-400 font-mono">{selectedCustomer.gstNo}</span>
                        </p>
                      )}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Outstanding Balance</p>
                      <p className={`text-xl font-black ${selectedCustomer.pendingBalance > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                        ₹{selectedCustomer.pendingBalance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Order History */}
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-3 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>Order History ({customerOrders.length})</span>
                  </h4>

                  <div className="space-y-3">
                    {customerOrders.length === 0 ? (
                      <p className="text-xs text-slate-500">No past orders found for this customer.</p>
                    ) : (
                      customerOrders.map(ord => (
                        <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-mono font-bold text-red-400 mr-2">{ord.jobNo}</span>
                              <span className="font-bold text-white">{ord.title}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full uppercase">
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-800/80">
                            <span>Category: <strong className="text-slate-200">{ord.category}</strong></span>
                            <span>Total: <strong className="text-white">₹{ord.totalAmount}</strong></span>
                            <span>Advance: <strong className="text-emerald-400">₹{ord.advancePaid}</strong></span>
                            <span>Due: <strong className="text-red-400">₹{ord.dueBalance}</strong></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Users className="w-12 h-12 text-slate-700 mb-3" />
                <p className="font-bold text-slate-400 text-sm">Select a customer from the left list</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  View complete billing history, outstanding dues ledger, and customer contact details.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
