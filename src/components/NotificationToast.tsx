import React from 'react';
import { useOrders } from '../context/OrderContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useOrders();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const isReady = toast.type === 'ready';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border transition-all duration-300 transform animate-slide-up flex items-start space-x-3 ${
              isReady 
                ? 'bg-gradient-to-r from-red-900/90 to-slate-900/95 border-red-500/80 shadow-red-900/50 ring-2 ring-red-500 animate-pulse-glow'
                : toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/60 shadow-emerald-900/30'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/60 shadow-amber-900/30'
                : 'bg-slate-900/95 border-blue-500/60 shadow-blue-900/30'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isReady ? (
                <div className="w-8 h-8 rounded-xl bg-red-600/30 flex items-center justify-center text-red-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-6 h-6 text-amber-400" />
              ) : (
                <Info className="w-6 h-6 text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-bold ${isReady ? 'text-white text-base' : 'text-slate-100'}`}>
                {toast.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
