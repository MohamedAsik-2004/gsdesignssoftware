import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { Header } from './components/Header';
import { NotificationToastContainer } from './components/NotificationToast';
import { AdminDashboard } from './pages/AdminDashboard';
import { DesignerWorkspace } from './pages/DesignerWorkspace';
import { PrintingRoomWorkspace } from './pages/PrintingRoomWorkspace';
import { BillingWorkspace } from './pages/BillingWorkspace';
import { CustomerDirectoryModal } from './components/CustomerDirectoryModal';
import { DailyReportModal } from './components/DailyReportModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LockScreenModal } from './components/LockScreenModal';
import { BroadcastModal } from './components/BroadcastModal';
import { UserRole } from './types';
import { 
  ShieldCheck, 
  Palette, 
  Printer, 
  Flame,
  Users, 
  BarChart3, 
  Phone, 
  Mail,
  Lock,
  PieChart,
  Radio,
  ExternalLink,
  Info,
  ArrowLeft,
  Monitor
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showServerUrls, setShowServerUrls] = useState(false);
  const [isTerminalLocked, setIsTerminalLocked] = useState(false);

  // 1. Dedicated URL Routing Logic for Separate Terminals / Rooms
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const deskQuery = params.get('desk')?.toUpperCase() as UserRole | null;

    let targetRole: UserRole | null = deskQuery;

    if (!targetRole) {
      if (path.includes('/admin')) targetRole = 'ADMIN';
      else if (path.includes('/designer')) targetRole = 'DESIGNER';
      else if (path.includes('/press') || path.includes('/printing')) targetRole = 'PRINTING';
      else if (path.includes('/billing')) targetRole = 'BILLING';
    }

    if (targetRole && currentUser.role !== targetRole) {
      switchRole(targetRole);
    }
  }, []);

  const handleDeskSwitch = (role: UserRole) => {
    switchRole(role);
    setShowAnalytics(false);
    
    // Update browser address bar to dedicated desk path
    const pathMap: Record<UserRole, string> = {
      ADMIN: '/admin',
      DESIGNER: '/designer',
      PRINTING: '/press',
      BILLING: '/billing'
    };
    const newPath = pathMap[role] || '/';
    window.history.pushState(null, '', newPath);
  };

  const getDeskUrl = (role: UserRole) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const pathMap: Record<UserRole, string> = {
      ADMIN: '/admin',
      DESIGNER: '/designer',
      PRINTING: '/press',
      BILLING: '/billing'
    };
    return `${origin}${pathMap[role]}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Header Navigation */}
      <Header />

      {/* Role-Based Workstation Sub-Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left Side: Station Identification & Master Switch (Admin Only) */}
          <div className="flex items-center space-x-2">
            
            {/* If Current View is ADMIN & User is ADMIN -> Show Master Multi-Desk Switcher */}
            {currentUser.role === 'ADMIN' ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-slate-400 font-bold hidden sm:inline mr-1">Admin Desk View:</span>
                
                <button
                  onClick={() => handleDeskSwitch('ADMIN')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 ${
                    currentUser.role === 'ADMIN' && !showAnalytics
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. Admin & Dispatch</span>
                </button>

                <button
                  onClick={() => handleDeskSwitch('DESIGNER')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-xl font-bold border border-slate-700 flex items-center space-x-1.5 transition-all"
                >
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>2. Designer Queue</span>
                </button>

                <button
                  onClick={() => handleDeskSwitch('PRINTING')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 rounded-xl font-bold border border-slate-700 flex items-center space-x-1.5 transition-all"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>3. Press Room</span>
                </button>

                <button
                  onClick={() => handleDeskSwitch('BILLING')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 rounded-xl font-bold border border-slate-700 flex items-center space-x-1.5 transition-all"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>4. Billing & Print</span>
                </button>
              </div>
            ) : (
              /* Dedicated Terminal Badge for Non-Admin Desks (DESIGNER, PRINTING, BILLING) */
              <div className="flex items-center space-x-3">
                
                {/* Specific Role Badge */}
                {currentUser.role === 'DESIGNER' && (
                  <div className="flex items-center space-x-2 bg-amber-950/60 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-amber-300 font-extrabold text-xs shadow-md">
                    <Palette className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>STATION: GRAPHIC DESIGNER QUEUE</span>
                  </div>
                )}

                {currentUser.role === 'PRINTING' && (
                  <div className="flex items-center space-x-2 bg-orange-950/60 border border-orange-500/40 px-3.5 py-1.5 rounded-xl text-orange-300 font-extrabold text-xs shadow-md">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span>STATION: PRESS ROOM & PRINT PRODUCTION</span>
                  </div>
                )}

                {currentUser.role === 'BILLING' && (
                  <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-emerald-300 font-extrabold text-xs shadow-md">
                    <Printer className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>STATION: BILLING & CUSTOMER DESK</span>
                  </div>
                )}

              </div>
            )}

            {/* Direct Server URLs Info Button */}
            <button
              onClick={() => setShowServerUrls(!showServerUrls)}
              title="View Separate Computer / Terminal Server URLs"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl border border-slate-700 flex items-center justify-center transition-all ml-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Side: Tools & Terminal Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Real-time Broadcast Message Button */}
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-extrabold border border-red-500/40 shadow-md shadow-red-900/30 flex items-center space-x-1.5 transition-all text-xs"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>Broadcast Alert</span>
            </button>

            {/* Admin-only Analytics Button */}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-3.5 py-1.5 rounded-xl font-bold border flex items-center space-x-1.5 transition-all text-xs ${
                  showAnalytics
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                }`}
              >
                <PieChart className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Analytics</span>
              </button>
            )}

            {/* Customer Directory Modal (Billing & Admin) */}
            {(currentUser.role === 'ADMIN' || currentUser.role === 'BILLING') && (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold border border-slate-700 flex items-center space-x-1.5 transition-all text-xs"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">Customer Directory</span>
              </button>
            )}

            {/* Daily Report Modal (Billing & Admin) */}
            {(currentUser.role === 'ADMIN' || currentUser.role === 'BILLING') && (
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-700 flex items-center space-x-1.5 transition-all text-xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Daily Report</span>
              </button>
            )}

            {/* Lock Screen Terminal Button */}
            <button
              onClick={() => setIsTerminalLocked(true)}
              title="Lock Terminal Screen"
              className="p-1.5 bg-red-950/70 hover:bg-red-900 text-red-400 rounded-xl border border-red-800 flex items-center justify-center transition-all"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Standalone Server URLs Drawer Banner */}
      {showServerUrls && (
        <div className="bg-slate-900 border-b border-cyan-500/30 px-4 py-3 text-xs animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Multi-Computer Station Direct Server URLs:</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
              <a 
                href={getDeskUrl('ADMIN')}
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-800 text-red-400 p-2 rounded-lg border border-red-500/30 flex items-center justify-between group"
              >
                <span>🛡️ Admin Desk:</span>
                <span className="font-bold text-white group-hover:underline">/admin</span>
              </a>

              <a 
                href={getDeskUrl('DESIGNER')}
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-800 text-amber-400 p-2 rounded-lg border border-amber-500/30 flex items-center justify-between group"
              >
                <span>🎨 Designer PC:</span>
                <span className="font-bold text-white group-hover:underline">/designer</span>
              </a>

              <a 
                href={getDeskUrl('PRINTING')}
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-800 text-orange-400 p-2 rounded-lg border border-orange-500/30 flex items-center justify-between group"
              >
                <span>🔥 Press Room PC:</span>
                <span className="font-bold text-white group-hover:underline">/press</span>
              </a>

              <a 
                href={getDeskUrl('BILLING')}
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-950 hover:bg-slate-800 text-emerald-400 p-2 rounded-lg border border-emerald-500/30 flex items-center justify-between group"
              >
                <span>𖤂 Billing Desk:</span>
                <span className="font-bold text-white group-hover:underline">/billing</span>
              </a>
            </div>

            <button
              onClick={() => setShowServerUrls(false)}
              className="text-slate-400 hover:text-white text-xs font-bold underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Body View based on Active Role Station */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {showAnalytics && currentUser.role === 'ADMIN' ? (
          <AnalyticsDashboard />
        ) : (
          <>
            {currentUser.role === 'ADMIN' && <AdminDashboard />}
            {currentUser.role === 'DESIGNER' && <DesignerWorkspace />}
            {currentUser.role === 'PRINTING' && <PrintingRoomWorkspace />}
            {currentUser.role === 'BILLING' && <BillingWorkspace />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-300 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-extrabold text-white text-sm">GS DESIGNS - ADVERTISING AGENCY</p>
            <p className="text-slate-400 text-xs mt-0.5">
              1/31, Public Office Road, Next to CRC Depot, Velippalayam, Nagapattinam - 611001.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>98432 19951 / 77088 66844</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-red-400" />
              <span>gsdesignsngt@gmail.com</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showCustomerModal && (
        <CustomerDirectoryModal onClose={() => setShowCustomerModal(false)} />
      )}

      {showReportModal && (
        <DailyReportModal onClose={() => setShowReportModal(false)} />
      )}

      {showBroadcastModal && (
        <BroadcastModal onClose={() => setShowBroadcastModal(false)} />
      )}

      {/* Lock Screen Overlay */}
      <LockScreenModal 
        isLocked={isTerminalLocked} 
        onUnlock={() => setIsTerminalLocked(false)} 
      />

      {/* Real-time Toast Notifications */}
      <NotificationToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
