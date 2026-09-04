import React, { useState } from 'react';
import { Megaphone, X, Send, Bell, Radio, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendBroadcastAnnouncement } from '../services/socket';
import { soundEngine } from '../utils/sound';

interface BroadcastModalProps {
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Trigger local alert chime sound test
    soundEngine.playAlertSound();

    // Broadcast across socket.io to all terminals
    sendBroadcastAnnouncement(currentUser.name, currentUser.role, message.trim(), isUrgent);

    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const presetMessages = [
    '⚡ Urgent: Client is waiting at counter for print output!',
    '✨ Design Ready: Customer proof approved. Send to Press Room!',
    '🔥 Press Room: Star Flex Banner output completed and ready for billing.',
    '🧾 Billing Desk: Cash payment received. Package ready for dispatch.',
    '⚠️ Admin Alert: All designers please clear pending urgent queue.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>Inter-Terminal Broadcast</span>
                <span className="text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-semibold uppercase">
                  All Desks
                </span>
              </h3>
              <p className="text-xs text-slate-400">Send live real-time audio alert & text message to all room terminals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center border border-emerald-500/30">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-lg font-black text-white">Broadcast Sent Successfully!</h4>
              <p className="text-xs text-slate-400">Notification & audio chime triggered on all active terminals.</p>
            </div>
          ) : (
            <>
              {/* Preset Quick Announcements */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Quick Announcement Templates:</span>
                  <span className="text-[10px] text-slate-500">Click to fill</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {presetMessages.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMessage(msg)}
                      className="text-left text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Broadcast Message:
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type an announcement to broadcast to Admin, Designer, Press, and Billing desks..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
              </div>

              {/* Priority Checkbox */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="isUrgent" className="text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>High Priority Flash Alert</span>
                  </label>
                </div>
                <span className="text-[10px] text-slate-400">Plays loud quad-chime tone</span>
              </div>

              {/* Sender Info Badge */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span>Sender: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role} Desk)</span>
                <button
                  type="button"
                  onClick={() => soundEngine.playChime()}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Test Chime</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-900/40 flex items-center space-x-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Alert</span>
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
};
