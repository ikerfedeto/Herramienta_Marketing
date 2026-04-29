import { type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  TrendingUp,
  LogOut,
  Bell,
  Menu,
  X,
  Users,
  Settings
} from 'lucide-react';
import type { AppUser, NavItem } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: AppUser;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
  { id: 'analyzer', label: 'Analizador', icon: Search },
  { id: 'creative', label: 'Estudio Creativo', icon: Sparkles },
  { id: 'roi', label: 'Predictor de ROI', icon: TrendingUp },
  { id: 'leads', label: 'Centro de Leads', icon: Users },
];

export function Layout({ children, activeTab, setActiveTab, onLogout, user }: LayoutProps) {
  const displayName = user.displayName || user.email || 'Usuario';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30">
            M
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight block leading-tight">MarketFlow</span>
            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Plataforma IA</span>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-600/20 text-white shadow-sm'
                  : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-indigo-400' : ''} />
              <span className="text-sm font-semibold">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff&bold=true`}
            alt={`Avatar de ${displayName}`}
            className="w-10 h-10 rounded-xl bg-indigo-900 border-2 border-indigo-500/30 object-cover"
          />
          <div className="flex flex-col text-left overflow-hidden">
            <p className="text-sm text-white font-semibold truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg transition-all font-semibold ${
              activeTab === 'settings'
                ? 'text-white bg-white/10'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={14} /> Ajustes
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all font-semibold"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-950 text-slate-300 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 text-slate-300 flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {activeTab === 'settings' ? 'Ajustes' : NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Plan Starter
            </span>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative" aria-label="Notificaciones">
              <Bell size={20} />
            </button>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff&bold=true`}
              alt={displayName}
              className="lg:hidden w-8 h-8 rounded-lg border border-slate-200 object-cover"
            />
          </div>
        </header>

        <section className="p-4 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
