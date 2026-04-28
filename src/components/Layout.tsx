import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Search, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: any;
}

export function Layout({ children, activeTab, setActiveTab, onLogout, user }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Deep Scraper', icon: Search },
    { id: 'creative', label: 'Estudio Creativo', icon: Sparkles },
    { id: 'roi', label: 'ROI y Predicciones', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
            <span className="text-white font-semibold text-lg tracking-tight">MarketFlow AI</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-slate-800 text-white' 
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.displayName}&background=4f46e5&color=fff`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-indigo-900 border border-indigo-500/30"
            />
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-sm text-white font-medium truncate">Iker Muñoz</p>
              <p className="text-xs text-slate-500">Plan Empresa</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="mt-4 flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Sistema Activo</span>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </header>

        <section className="p-8 flex-1 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
