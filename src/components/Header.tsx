import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { UserRole } from '../types';
import { 
  Printer, 
  Palette, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  Phone, 
  MapPin, 
  CheckCheck, 
  UserCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, users, loginAs } = useAuth();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useOrders();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Filter notifications for current user role or ALL
  const userNotifs = notifications.filter(n => 
    n.roleTarget === 'ALL' || n.roleTarget === currentUser.role
  );
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <ShieldCheck className="w-4 h-4 text-red-400" />;
      case 'DESIGNER': return <Palette className="w-4 h-4 text-amber-400" />;
      case 'PRINTING': return <Printer className="w-4 h-4 text-amber-500" />;
      case 'BILLING': return <Printer className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'DESIGNER': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'PRINTING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'BILLING': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Shop Info */}
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-lg shadow-red-900/40 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                    GS
                  </span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
                  GS DESIGNS
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                    ADVERTISING AGENCY
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-red-400 font-medium">Invitation</span> • 
                <span className="text-amber-400 font-medium">Flex</span> • 
                <span className="text-emerald-400 font-medium">Notice</span> • 
                <span className="text-blue-400 font-medium">LOGO</span> • 
                <span className="text-purple-400 font-medium">Shield & Mementos</span>
              </p>
            </div>
          </div>

          {/* Center Info: Address & Contact */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 border-x border-slate-800 px-6 py-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-slate-200 font-medium">Nagapattinam Branch</p>
                <p className="text-slate-400 text-[11px]">Public Office Rd, Velippalayam</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-slate-200 font-medium">98432 19951</p>
                <p className="text-slate-400 text-[11px]">77088 66844</p>
              </div>
            </div>
          </div>

          {/* Right Controls: Notifications & Switch Desk */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-red-600/50 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden z-50 animate-slide-up">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="font-semibold text-sm text-white">Live Workflow Notifications</h3>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {userNotifs.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        No notifications yet for this role desk.
                      </div>
                    ) : (
                      userNotifs.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3.5 cursor-pointer transition-all hover:bg-slate-800/60 ${
                            !n.isRead ? 'bg-red-500/5 border-l-2 border-red-500' : 'opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-xs text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {n.jobNo}
                            </span>
                            {!n.isRead && (
                              <span className="text-red-400 font-medium">New</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role / User Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-slate-700" 
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[130px]">
                    {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
                  </p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className={`inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                      {getRoleIcon(currentUser.role)}
                      <span className="ml-1 uppercase tracking-wider">{currentUser.role}</span>
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-slide-up">
                  <div className="p-3 bg-slate-900/80 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Desk (Simulation)
                    </p>
                  </div>
                  <div className="p-1 space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          loginAs(u.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-3 transition-all ${
                          currentUser.id === u.id 
                            ? 'bg-red-600/20 text-white border border-red-500/40' 
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            {getRoleIcon(u.role)}
                            <span>{u.role}</span>
                          </p>
                        </div>
                        {currentUser.id === u.id && (
                          <UserCheck className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
