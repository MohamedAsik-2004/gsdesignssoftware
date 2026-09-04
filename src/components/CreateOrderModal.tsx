import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { OrderCategory, FlexSpecs, InvitationSpecs, NoticeSpecs, GeneralSpecs } from '../types';
import { FlexCalculator } from './FlexCalculator';
import { 
  X, 
  Sparkles, 
  User, 
  Phone, 
  Palette, 
  FileText, 
  CreditCard, 
  PlusCircle,
  Image,
  Award,
  Layers
} from 'lucide-react';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { createOrder } = useOrders();
  const { users } = useAuth();
  const designers = users.filter(u => u.role === 'DESIGNER');

  const [category, setCategory] = useState<OrderCategory>('FLEX');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Specs
  const [flexSpecs, setFlexSpecs] = useState<FlexSpecs>({
    widthFt: 10,
    heightFt: 4,
    sqFt: 40,
    ratePerSqFt: 25,
    finishType: 'Star Flex',
    frameIncluded: false
  });

  const [invitationSpecs, setInvitationSpecs] = useState<InvitationSpecs>({
    cardType: 'Wedding Card',
    quantity: 300,
    paperType: 'Glossy 300GSM',
    printType: 'Single Side'
  });

  const [noticeSpecs, setNoticeSpecs] = useState<NoticeSpecs>({
    paperSize: 'A4',
    quantity: 1000,
    printType: 'Single Side Color'
  });

  const [generalSpecs, setGeneralSpecs] = useState<GeneralSpecs>({
    itemType: 'Logo Package',
    quantity: 1,
    notes: ''
  });

  // Financials
  const [manualTotal, setManualTotal] = useState<number>(1000);
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>(designers[0]?.id || 'u-2');

  if (!isOpen) return null;

  // Auto calculate estimated price based on category
  const calculateTotal = () => {
    switch (category) {
      case 'FLEX':
        const sqft = flexSpecs.sqFt || (flexSpecs.widthFt * flexSpecs.heightFt);
        return (flexSpecs.widthFt * flexSpecs.heightFt * flexSpecs.ratePerSqFt) + (flexSpecs.frameIncluded ? sqft * 12 : 0);
      case 'INVITATION':
        return invitationSpecs.quantity * (invitationSpecs.printType === 'Foil Stamping' ? 12 : 8);
      case 'NOTICE':
        return noticeSpecs.quantity * ((noticeSpecs.printType || '').includes('Color') ? 3.5 : 1.5);
      case 'LOGO':
        return 3500;
      case 'SHIELD_MEMENTO':
        return generalSpecs.quantity * 450;
      default:
        return manualTotal;
    }
  };

  const currentComputedTotal = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !title) return;

    const designerObj = designers.find(d => d.id === selectedDesignerId);

    createOrder({
      customerName,
      customerPhone,
      customerEmail,
      category,
      title,
      description,
      flexSpecs: category === 'FLEX' ? flexSpecs : undefined,
      invitationSpecs: category === 'INVITATION' ? invitationSpecs : undefined,
      noticeSpecs: category === 'NOTICE' ? noticeSpecs : undefined,
      generalSpecs: (category === 'LOGO' || category === 'SHIELD_MEMENTO' || category === 'OTHER') ? generalSpecs : undefined,
      totalAmount: currentComputedTotal,
      advancePaid: Number(advancePaid),
      designerId: selectedDesignerId,
      designerName: designerObj?.name || 'Ramesh K.'
    });

    onClose();
  };

  const categories: { id: OrderCategory; label: string; icon: any; color: string }[] = [
    { id: 'FLEX', label: 'Flex / Banner', icon: Image, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { id: 'INVITATION', label: 'Invitation Card', icon: FileText, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
    { id: 'NOTICE', label: 'Notice / Pamphlet', icon: Layers, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { id: 'LOGO', label: 'Logo Branding', icon: Palette, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    { id: 'SHIELD_MEMENTO', label: 'Shield & Memento', icon: Award, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-slide-up my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Order & Assign Job</h3>
              <p className="text-xs text-slate-400">GS Designs Order Entry & Auto-Forward System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Category Select */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Job Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {categories.map(c => {
                const Icon = c.icon;
                const isSelected = category === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start justify-between space-y-2 ${
                      isSelected 
                        ? 'border-red-500 bg-red-500/15 ring-2 ring-red-500/50 text-white' 
                        : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${c.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold block leading-tight">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Customer / Organization Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Sweets / Mr. Arul"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Mobile / WhatsApp Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 98432 00000"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Order Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10x4 Grand Opening Flex Banner"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Design Instructions / Text Content</label>
              <textarea
                rows={2}
                placeholder="Specify font preferences, Tamil/English content, phone numbers to print..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Specifications */}
          {category === 'FLEX' && (
            <FlexCalculator 
              initialSpecs={flexSpecs}
              onChange={specs => setFlexSpecs(specs)}
            />
          )}

          {category === 'INVITATION' && (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Invitation Card Specs</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Quantity (Cards)</label>
                  <input 
                    type="number" 
                    value={invitationSpecs.quantity}
                    onChange={e => setInvitationSpecs({...invitationSpecs, quantity: Number(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Paper Type</label>
                  <select 
                    value={invitationSpecs.paperType}
                    onChange={e => setInvitationSpecs({...invitationSpecs, paperType: e.target.value as any})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="Glossy 300GSM">Glossy 300GSM</option>
                    <option value="Matte Card">Matte Card</option>
                    <option value="Metallic">Metallic Gold Card</option>
                    <option value="Handmade">Handmade Board</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Print Finishing</label>
                  <select 
                    value={invitationSpecs.printType}
                    onChange={e => setInvitationSpecs({...invitationSpecs, printType: e.target.value as any})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="Single Side">Single Side Color</option>
                    <option value="Double Side">Double Side Color</option>
                    <option value="Foil Stamping">Gold Foil Stamping</option>
                    <option value="Embossed">Embossed Foil</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {category === 'NOTICE' && (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Notice / Flyer Specs</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Size</label>
                  <select 
                    value={noticeSpecs.paperSize || noticeSpecs.size || 'A4'}
                    onChange={e => setNoticeSpecs({...noticeSpecs, paperSize: e.target.value as any, size: e.target.value as any})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="A4">A4 Size</option>
                    <option value="A5">A5 Size (Half A4)</option>
                    <option value="Pamphlet (1/4)">Pamphlet (1/4 A4)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={noticeSpecs.quantity}
                    onChange={e => setNoticeSpecs({...noticeSpecs, quantity: Number(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Printing Type</label>
                  <select 
                    value={noticeSpecs.printType}
                    onChange={e => setNoticeSpecs({...noticeSpecs, printType: e.target.value as any})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="Single Side Color">Single Side Color</option>
                    <option value="Both Sides Color">Both Sides Color</option>
                    <option value="Single Side Black & White">Black & White (Bulk)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Assign Designer & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Select Designer */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Assign to Designer *</span>
              </label>
              <select
                value={selectedDesignerId}
                onChange={e => setSelectedDesignerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-medium focus:border-amber-500 focus:outline-none"
              >
                {designers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.email})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-2">
                Designer will receive an immediate notification on their workspace queue.
              </p>
            </div>

            {/* Financial Calculations */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Computed Amount:</span>
                <span className="font-mono font-bold text-white">₹{currentComputedTotal}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Advance Paid (₹):</span>
                <input 
                  type="number"
                  value={advancePaid}
                  onChange={e => setAdvancePaid(Number(e.target.value))}
                  className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-emerald-400 font-bold text-right"
                />
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">Due Balance:</span>
                <span className="text-base font-extrabold font-mono text-red-400">
                  ₹{Math.max(0, currentComputedTotal - advancePaid)}
                </span>
              </div>
            </div>

          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create & Notify Designer</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
