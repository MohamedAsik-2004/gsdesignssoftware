import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { UserRole } from '../types';
import { 
  MessageSquare, 
  Send, 
  X, 
  Users, 
  ShieldCheck, 
  Palette, 
  Printer, 
  IndianRupee, 
  Sparkles, 
  Trash2,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface InterDeskChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterDeskChatModal: React.FC<InterDeskChatModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { chatMessages, sendTerminalChatMessage, clearChatMessages } = useOrders();
  
  const [targetRole, setTargetRole] = useState<UserRole | 'ALL'>('ALL');
  const [messageText, setMessageText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendTerminalChatMessage(targetRole, messageText.trim(), undefined, isUrgent);
    setMessageText('');
    setIsUrgent(false);
  };

  const handlePresetClick = (presetText: string) => {
    sendTerminalChatMessage(targetRole, presetText, undefined, isUrgent);
  };

  const getRoleBadgeClass = (role: UserRole | 'ALL') => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'DESIGNER': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'PRINTING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'BILLING': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ALL': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  const getRoleIcon = (role: UserRole | 'ALL') => {
    switch (role) {
      case 'ADMIN': return <ShieldCheck className="w-3.5 h-3.5 text-red-400" />;
      case 'DESIGNER': return <Palette className="w-3.5 h-3.5 text-amber-400" />;
      case 'PRINTING': return <Printer className="w-3.5 h-3.5 text-amber-400" />;
      case 'BILLING': return <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ALL': return <Users className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // Filter visible messages for current terminal
  const visibleMessages = chatMessages.filter(m => 
    m.targetRole === 'ALL' || 
    m.targetRole === currentUser.role || 
    m.senderRole === currentUser.role
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                4-Way Terminal Messenger
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h3>
              <p className="text-xs text-slate-400">Live inter-desk communication across all 4 stations</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearChatMessages}
              title="Clear Chat History"
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recipient Target Selector */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Terminal Desk</label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'ALL', label: 'All Desks', icon: Users, color: 'indigo' },
              { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, color: 'red' },
              { id: 'DESIGNER', label: 'Designer', icon: Palette, color: 'amber' },
              { id: 'PRINTING', label: 'Press Room', icon: Printer, color: 'amber' },
              { id: 'BILLING', label: 'Billing', icon: IndianRupee, color: 'emerald' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTargetRole(tab.id as any)}
                className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  targetRole === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/40 scale-105'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          {[
            '🖨️ Press Room: Ready for printing output',
            '🎨 Designer: Proof uploaded for review',
            '💰 Billing: Invoice payment received',
            '🚨 Admin: High Priority Order!',
            '⚠️ Paper / Material Reload Needed'
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] whitespace-nowrap transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Chat Timeline */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20">
          {visibleMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No terminal messages yet</p>
              <p className="text-xs text-slate-500 mt-1">Select a desk and send a real-time message to start</p>
            </div>
          ) : (
            visibleMessages.map(msg => {
              const isSelf = msg.senderName === currentUser.name;
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-1">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${getRoleBadgeClass(msg.senderRole)}`}>
                      {getRoleIcon(msg.senderRole)}
                      <span>{msg.senderRole}</span>
                    </span>
                    <span className="font-semibold text-slate-300">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1 ${
                    isSelf 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-lg shadow-indigo-900/30'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none shadow-md'
                  }`}>
                    {msg.isUrgent && (
                      <div className="flex items-center space-x-1 text-red-300 font-extrabold text-[10px] uppercase mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>URGENT TERMINAL ALERT</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <div className="text-[9px] text-slate-400 text-right mt-1 pt-1 border-t border-white/10">
                      Target: <span className="font-bold uppercase text-slate-200">{msg.targetRole}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Mark Urgent
                </span>
              </label>
            </div>
            <span className="text-[11px] text-slate-400">
              Sending to: <strong className="text-indigo-400 uppercase">{targetRole}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Message ${targetRole} station...`}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
