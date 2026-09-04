import React, { useState } from 'react';
import { Order } from '../types';
import { X, Send, MessageSquare, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface WhatsAppShareModalProps {
  order: Order;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({ order, onClose }) => {
  const [templateType, setTemplateType] = useState<'CONFIRMATION' | 'PROOF' | 'PICKUP'>('PROOF');
  const [copied, setCopied] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    return cleaned;
  };

  const getMessageContent = () => {
    const shopHeader = `*GS DESIGNS - ADVERTISING AGENCY*\n📍 1/31, Public Office Road, Nagapattinam\n📞 98432 19951 / 77088 66844\n---------------------------------`;

    if (templateType === 'CONFIRMATION') {
      return `${shopHeader}\n\nDear *${order.customerName}*,\n\nThank you for booking your order with GS Designs!\n\n📋 *Job No:* ${order.jobNo}\n📌 *Order:* ${order.title}\n💰 *Total Amount:* ₹${order.totalAmount}\n✅ *Advance Paid:* ₹${order.advancePaid}\n⌛ *Balance Due:* ₹${order.dueBalance}\n🎨 *Assigned Designer:* ${order.designerName}\n\nWe will share your design proof shortly for approval.\n\n_GS Designs Team_`;
    }

    if (templateType === 'PROOF') {
      return `${shopHeader}\n\nDear *${order.customerName}*,\n\n🎨 Your design proof for *${order.title}* (${order.jobNo}) is **READY FOR APPROVAL**!\n\n🖼️ *View Design Proof:* ${order.designFileUrl || 'Attached in chat'}\n📝 *Designer Notes:* ${order.designerNotes || 'Please check text, phone numbers, and colors.'}\n\nKindly review and reply to this message with **"APPROVED"** to start printing.\n\n_GS Designs Team_`;
    }

    return `${shopHeader}\n\nDear *${order.customerName}*,\n\n🎉 Your order *${order.title}* (${order.jobNo}) is **READY FOR PICKUP**!\n\n🧾 *Invoice No:* #${order.invoiceNo || 'INV-2026'}\n💰 *Total Bill:* ₹${order.totalAmount}\n💳 *Balance Due:* ₹${order.dueBalance}\n\n📍 *Shop Location:* GS DESIGNS, Public Office Road (Next to CRC Depot), Velippalayam, Nagapattinam.\n\nThank you for choosing GS Designs!`;
  };

  const messageText = getMessageContent();
  const phoneNo = formatPhoneNumber(order.customerPhone);
  const whatsappUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(messageText)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                <span>WhatsApp Customer Messenger</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">1-Click Send</span>
              </h3>
              <p className="text-xs text-slate-400">Customer: <strong className="text-slate-200">{order.customerName}</strong> ({order.customerPhone})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Template Selection Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Message Template:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setTemplateType('CONFIRMATION')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  templateType === 'CONFIRMATION'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                1. Booking
              </button>
              <button
                onClick={() => setTemplateType('PROOF')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  templateType === 'PROOF'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                2. Design Proof
              </button>
              <button
                onClick={() => setTemplateType('PICKUP')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  templateType === 'PICKUP'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                3. Pickup & Bill
              </button>
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-400">Message Preview:</span>
              <button
                onClick={handleCopyText}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {messageText}
            </div>
          </div>

          {/* WhatsApp Direct Open Button */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>Open WhatsApp & Send to +{phoneNo}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Opens WhatsApp Web or App directly with pre-filled message text.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
