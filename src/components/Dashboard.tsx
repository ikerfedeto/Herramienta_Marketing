import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Target, Activity, 
  ArrowUpRight, Info, ShieldCheck, Sparkles, 
  Zap, PieChart, BarChart3, Database,
  Eye, MousePointer2, Wallet
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  Cell
} from 'recharts';

const growthData = [
  { name: 'Lun', leads: 40, predicted: 45 },
  { name: 'Mar', leads: 30, predicted: 42 },
  { name: 'Mie', leads: 65, predicted: 50 },
  { name: 'Jue', leads: 55, predicted: 55 },
  { name: 'Vie', leads: 90, predicted: 70 },
  { name: 'Sab', leads: 110, predicted: 85 },
  { name: 'Dom', leads: 95, predicted: 90 },
];

const funnelData = [
  { value: 10000, name: 'Impresiones', fill: '#6366f1' },
  { value: 800, name: 'Clicks', fill: '#818cf8' },
  { value: 120, name: 'Leads', fill: '#a5b4fc' },
  { value: 45, name: 'Clientes', fill: '#c7d2fe' },
];

const channelData = [
  { name: 'Ads', value: 45 },
  { name: 'SEO', value: 30 },
  { name: 'Social', value: 15 },
  { name: 'Direct', value: 10 },
];

export function Dashboard() {
  const stats = [
    { 
      label: 'Visitantes Únicos', 
      value: '24.5k', 
      trend: '+14.2%', 
      icon: Eye,
      confidence: 98,
      origin: 'Google Analytics + Global Pixel',
      formula: 'Usted x IP Unívoca'
    },
    { 
      label: 'CPL Promedio', 
      value: '€2.45', 
      trend: '-8.1%', 
      icon: Wallet,
      confidence: 92,
      origin: 'AdSpend / IA Funnel Tracking',
      formula: 'Gasto Total / Conversiones'
    },
    { 
      label: 'Tasa de Conversión', 
      value: '3.82%', 
      trend: '+0.5%', 
      icon: Target,
      confidence: 95,
      origin: 'Event Mapping v2',
      formula: 'Checked Out / Visitantes'
    },
    { 
      label: 'ROI Proyectado', 
      value: '512%', 
      trend: '+22%', 
      icon: TrendingUp,
      confidence: 88,
      origin: 'Predictivo MarketFlow AI',
      formula: 'LTV Estimado / CAC'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-12"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Marketing Intelligence Center</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Database size={12} /> Live Data Stream <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="mx-2 text-slate-200">|</span>
            <span className="text-[10px]">Actualizado: hace 4 minutos</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score Compra Digital</span>
             <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-indigo-600 rounded-full" />
                </div>
                <span className="text-xs font-black text-indigo-600">84/100</span>
             </div>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm relative group">
            <Info size={18} />
            <div className="absolute top-full mt-2 right-0 w-64 p-4 bg-slate-900 text-white rounded-2xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
              Nuestros datos combinan señales directas de tu web con benchmarks de mercado procesados por GPT-4o.
            </div>
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 hover:border-indigo-200 transition-all group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-50 rounded-full -z-1 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                  <stat.icon size={22} />
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-xs font-black flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stat.trend} <ArrowUpRight size={10} />
                  </span>
                   <div className="flex items-center gap-1 mt-1">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-slate-400 capitalize">{stat.confidence}% Conf.</span>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter text-slate-900 mb-1">{stat.value}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{stat.label}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-300 uppercase">Origen</span>
                  <span className="text-[9px] font-bold text-slate-500">{stat.origin}</span>
               </div>
               <div className="relative group/tooltip">
                  <Info size={12} className="text-slate-300 pointer-cursor" />
                  <div className="absolute bottom-full mb-2 right-0 w-32 p-2 bg-slate-900 text-white rounded-lg text-[8px] opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50">
                    {stat.formula}
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-8 p-10 rounded-[40px] bg-white border border-slate-200 shadow-2xl shadow-slate-200/30 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Tracción de Leads y Predicción</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} /> Comparativa: Real vs Benchmarks AI
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Predictivo</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    padding: '16px'
                  }} 
                  labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', color: '#4338ca', marginBottom: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Section */}
        <div className="lg:col-span-4 p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
             <PieChart size={300} />
          </div>
          
          <div className="relative z-10 h-full flex flex-col gap-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight text-white">Salud del Funnel</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Conversión End-to-End</p>
            </div>

            <div className="flex-1 flex flex-col justify-between py-6">
               {funnelData.map((item, idx) => (
                 <div key={item.name} className="space-y-2 group/item">
                    <div className="flex items-center justify-between text-xs font-black">
                       <span className="text-slate-400 uppercase tracking-widest">{item.name}</span>
                       <span className="text-white">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / funnelData[0].value) * 100}%` }}
                          transition={{ delay: 0.5 + (idx * 0.1), duration: 1.5 }}
                          className="h-full rounded-full shadow-lg"
                          style={{ backgroundColor: item.fill }}
                       />
                    </div>
                    {idx < funnelData.length - 1 && (
                      <div className="flex justify-center -my-1">
                        <div className="text-[10px] font-black text-indigo-500/50">
                           {((funnelData[idx+1].value / item.value) * 100).toFixed(1)}% drop-off
                        </div>
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500 rounded-xl">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">AI Insight</span>
               </div>
               <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                 El mayor abandono ocurre entre <span className="text-white font-bold">Clicks y Leads (85%)</span>. Mejorar el tiempo de carga de la landing podría incrementar el ROI total en un <span className="text-emerald-400 font-bold">12.5%</span>.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Table/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Channel Efficiency */}
        <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-xl space-y-6">
           <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={18} /> Rendimiento por Canal
           </h3>
           <div className="space-y-5">
              {channelData.map(c => (
                <div key={c.name} className="flex items-center gap-4">
                   <div className="w-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.name}</div>
                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${c.value}%` }} 
                        className={`h-full rounded-full ${c.value > 40 ? 'bg-indigo-600' : c.value > 20 ? 'bg-indigo-400' : 'bg-slate-300'}`} 
                      />
                   </div>
                   <div className="w-8 text-[11px] font-black text-slate-900 text-right">{c.value}%</div>
                </div>
              ))}
           </div>
        </div>

        {/* Tactical Suggestions */}
        <div className="lg:col-span-2 p-8 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col justify-center items-center text-center space-y-4">
           <div className="p-5 bg-white rounded-full shadow-xl border border-slate-100">
              <Zap size={32} className="text-indigo-600 fill-current" />
           </div>
           <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Generador de Recomendaciones Estratégicas</h4>
              <p className="text-xs font-medium text-slate-500 max-w-md mx-auto">
                Analiza las tendencias de hoy para ajustar tu presupuesto de mañana. El sistema sugiere reubicar <span className="text-indigo-600 font-black">€1,200</span> de Social a SEO este trimestre.
              </p>
           </div>
           <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
             Ejecutar Optimización Automática
           </button>
        </div>
      </div>
    </motion.div>
  );
}
