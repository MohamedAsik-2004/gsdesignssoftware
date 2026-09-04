import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Unlock, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

interface LockScreenModalProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({ isLocked, onUnlock }) => {
  const { currentUser } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isLocked) return null;

  const expectedPin = currentUser?.pin || '1234';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin || pin === '1234') {
      setPin('');
      setError('');
      onUnlock();
    } else {
      setError('Incorrect PIN code. Try again.');
      setPin('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-red-500/30 shadow-2xl text-center space-y-6">
        
        {/* Lock Icon Header */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40 shadow-lg shadow-red-900/30 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Terminal Locked</h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser ? `${currentUser.name} (${currentUser.role} Desk)` : 'GS Designs Desk Security'}
          </p>
        </div>

        {/* PIN Display Dots */}
        <div className="flex justify-center space-x-3 py-2">
          {[0, 1, 2, 3].map(index => (
            <div 
              key={index} 
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > index 
                  ? 'bg-red-500 border-red-400 shadow-md shadow-red-500/50 scale-110' 
                  : 'border-slate-700 bg-slate-900'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-xs font-semibold text-red-400 flex items-center justify-center space-x-1 animate-bounce">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="py-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800/80 active:bg-red-600/30 text-lg font-bold text-white font-mono transition-all shadow"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-lg font-bold text-white font-mono"
            >
              0
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 disabled:opacity-40 text-white font-bold flex items-center justify-center space-x-1 text-xs"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock</span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500">
          Default Master PIN: <code className="text-slate-400 font-mono">1234</code>
        </p>

      </div>
    </div>
  );
};
