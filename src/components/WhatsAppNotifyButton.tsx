import React from 'react';
import { Order } from '../types';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface WhatsAppNotifyButtonProps {
  order: Order;
  customMessageType?: 'DESIGN_READY' | 'PRINT_READY' | 'PAYMENT_RECEIPT' | 'GENERAL_UPDATE';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WhatsAppNotifyButton: React.FC<WhatsAppNotifyButtonProps> = ({ 
  order, 
  customMessageType, 
  className = '',
  size = 'md'
}) => {
  // Format Indian Mobile Number
  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return '91' + digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits;
  };

  const generateMessage = (): string => {
    const type = customMessageType || order.status;

    switch (type) {
      case 'DESIGN_READY':
        return `*GS DESIGNS - Design Proof Ready!* 🎨\n\nDear *${order.customerName}*,\nYour design proof for *"${order.title}"* (Job No: ${order.jobNo}) is ready for your approval!\n\n👇 *View & Approve Proof:* ${order.proofUrl || 'https://gsdesigns.in/proof'}\n\nPlease reply with "APPROVED" or specify changes.\nThank you!\n*GS Designs Nagercoil* (Ph: 9843219951)`;

      case 'PRINT_READY':
      case 'FORWARDED_TO_BILLING':
        return `*GS DESIGNS - Printing Complete & Ready!* 🖨️✨\n\nDear *${order.customerName}*,\nYour flex/printing order *"${order.title}"* (Job No: ${order.jobNo}) is printed and ready for pickup!\n\n💰 *Total Amount:* ₹${order.totalAmount}\n💳 *Advance Paid:* ₹${order.advancePaid}\n🔴 *Due Balance:* ₹${order.dueBalance}\n\nLocation: GS Designs, Opp Collectorate, Nagercoil.\nThank you!`;

      case 'PAYMENT_RECEIPT':
        return `*GS DESIGNS - Payment Received* 🧾✅\n\nDear *${order.customerName}*,\nWe received your payment for Job *${order.jobNo}* (${order.title}).\n\n💰 *Total Order Value:* ₹${order.totalAmount}\n💳 *Advance Paid:* ₹${order.advancePaid}\n📌 *Remaining Balance:* ₹${order.dueBalance}\n\nThank you for choosing GS Designs!`;

      default:
        return `*GS DESIGNS Order Status Update* 📢\n\nDear *${order.customerName}*,\nUpdate regarding your order *"${order.title}"* (Job No: ${order.jobNo}). Current status: *${order.status.replace(/_/g, ' ')}*.\n\nFor queries, call us at 98432 19951.`;
    }
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = cleanPhone(order.customerPhone);
    if (!phone) {
      alert('Invalid phone number for WhatsApp message');
      return;
    }

    const message = generateMessage();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs space-x-1 rounded-lg',
    md: 'px-3 py-1.5 text-xs font-semibold space-x-1.5 rounded-xl',
    lg: 'px-4 py-2.5 text-sm font-bold space-x-2 rounded-2xl'
  };

  return (
    <button
      type="button"
      onClick={handleSendWhatsApp}
      title={`Send WhatsApp message to ${order.customerPhone}`}
      className={`inline-flex items-center justify-center bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-all shadow-sm group ${sizeClasses[size]} ${className}`}
    >
      <MessageSquare className="w-3.5 h-3.5 fill-current text-emerald-400 group-hover:text-white" />
      <span>WhatsApp Notify</span>
      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
    </button>
  );
};
