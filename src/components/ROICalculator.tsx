import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Calculator, Info, Loader2, Sparkles, 
  Target, Zap, AlertCircle, BarChart3, Clock, Rocket, ShieldCheck
} from 'lucide-react';
import { predictROI } from '../services/geminiService';
import type { ROIParams, ROIPrediction } from '../types';
import { SECTOR_BENCHMARKS } from '../types';

export function ROICalculator() {
  const [params, setParams] = useState<ROIParams>({
    investment: 2000,
    channel: 'Google Ads',
    sector: 'General',
    location: 'España',
    avgTicket: 150,
    digitalLevel: 'medio'
  });

  const [calculating, setCalculating] = useState(false);
  const [aiResult, setAiResult] = useState<ROIPrediction | null>(null);

  // Deterministic local calculation for real-time feedback
  const localProjection = useMemo(() => {
    const benchmark = SECTOR_BENCHMARKS[params.sector] || SECTOR_BENCHMARKS['General'];
    
    // Adjustments based on digital level
    const levelMultiplier = { 'bajo': 0.6, 'medio': 1, 'alto': 1.4 }[params.digitalLevel];
    
    const clicks = params.investment / benchmark.cpc;
    const conversions = clicks * (benchmark.cr / 100) * levelMultiplier;
    const revenue = conversions * params.avgTicket;
    const roi = ((revenue - params.investment) / params.investment) * 100;
    
    return {
      clicks: Math.round(clicks),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      roi: Math.round(roi)
    };
  }, [params]);

  const handleDeepAnalysis = async () => {
    setCalculating(true);
    try {
      const data = await predictROI(params);
      setAiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600">
          <Zap size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest">MarketFlow Engine v2.0</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Predictor de ROI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Inteligente</span></h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
          Simula el impacto económico de tu estrategia basándote en benchmarks reales del sector y el nivel de madurez digital de tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8">
            <h3 className="font-black flex items-center gap-2 text-slate-800 text-lg">
              <Calculator className="text-indigo-600" size={20} /> Inputs de Simulación
            </h3>
            
            <div className="space-y-6">
              {/* Investment Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Presupuesto (€)</label>
                  <span className="text-lg font-black text-slate-900">€{params.investment.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={params.investment}
                  onChange={(e) => setParams({...params, investment: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Ticket Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Ticket Medio (€)</label>
                  <span className="text-lg font-black text-slate-900">€{params.avgTicket.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min={10}
                  max={5000}
                  step={10}
                  value={params.avgTicket}
                  onChange={(e) => setParams({...params, avgTicket: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Selects */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Sector</label>
                  <select 
                    value={params.sector}
                    onChange={(e) => setParams({...params, sector: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {Object.keys(SECTOR_BENCHMARKS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nivel Digital</label>
                  <select 
                    value={params.digitalLevel}
                    onChange={(e) => setParams({...params, digitalLevel: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="bajo">Bajo (Web básica)</option>
                    <option value="medio">Medio (Optimizado)</option>
                    <option value="alto">Alto (Crack)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleDeepAnalysis}
                  disabled={calculating}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {calculating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="fill-current" size={20} />}
                  Deep Analysis IA
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <Info size={14} /> Cómo calculamos esto
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Utilizamos fórmulas deterministas cruzadas con benchmarks sectoriales. El "Nivel Digital" ajusta tu tasa de conversión en un ±40% basado en la experiencia de usuario y velocidad de carga.
            </p>
          </div>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {!aiResult ? (
              <motion.div 
                key="realtime"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                        <TrendingUp size={80} />
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ROI Estimado</span>
                     <p className={`text-5xl font-black ${localProjection.roi > 0 ? 'text-indigo-600' : 'text-rose-500'}`}>{localProjection.roi}%</p>
                     <span className="text-[10px] font-bold text-slate-400">Basado en benchmarks locales</span>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ingresos Proyectados</span>
                     <p className="text-4xl font-black text-slate-900">€{localProjection.revenue.toLocaleString()}</p>
                     <span className="text-[10px] font-bold text-slate-400">{localProjection.conversions} conversiones est.</span>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CPA Objetivo</span>
                     <p className="text-4xl font-black text-slate-900">€{(params.investment / (localProjection.conversions || 1)).toFixed(2)}</p>
                     <span className="text-[10px] font-bold text-slate-400">Coste por adquisición máximo</span>
                  </div>
                </div>

                <div className="p-10 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-center space-y-4">
                  <BarChart3 size={48} className="text-indigo-200" />
                  <div className="space-y-1">
                    <h4 className="text-indigo-900 font-black uppercase tracking-widest text-sm">Escalado Predictivo Habilitado</h4>
                    <p className="text-indigo-600/70 text-xs font-medium max-w-sm">
                      Mueve los controles de la izquierda para ver el impacto en tiempo real. Pulsa "Deep Analysis IA" para obtener escenarios optimistas y estratégicos.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="ai-result"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                {/* Scenario Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: 'conservador', label: 'Conservador', color: 'slate', icon: ShieldCheck },
                    { type: 'base', label: 'Escenario Base', color: 'indigo', icon: Target },
                    { type: 'optimista', label: 'Optimista', color: 'purple', icon: Rocket }
                  ].map((s) => {
                    const data = aiResult.escenarios[s.type as keyof typeof aiResult.escenarios];
                    return (
                      <div key={s.type} className={`p-6 rounded-3xl border-2 transition-all ${s.type === 'base' ? 'border-indigo-600 bg-white shadow-2xl scale-105 z-10' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                         <div className="flex items-center justify-between mb-4">
                            <s.icon size={20} className={s.type === 'base' ? 'text-indigo-600' : 'text-slate-400'} />
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${s.type === 'base' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                              {s.label}
                            </span>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">ROI Estimado</span>
                            <p className={`text-4xl font-black ${s.type === 'base' ? 'text-indigo-600' : 'text-slate-900'}`}>{data.roi}%</p>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Ventas</span>
                               <p className="text-sm font-black text-slate-800">{data.conversiones}</p>
                            </div>
                            <div>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Revenue</span>
                               <p className="text-sm font-black text-slate-800">€{data.revenue.toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Analysis and Suggestions */}
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                       <BarChart3 className="text-indigo-600" size={20} /> Análisis Estratégico
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {aiResult.analisis_detallado}
                    </p>
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                       <div className="flex items-center gap-2">
                          <Clock className="text-indigo-600" size={16} />
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase">Break Even</span>
                             <span className="text-xs font-black">{aiResult.break_even_days} días</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <AlertCircle className="text-emerald-600" size={16} />
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase">Confianza</span>
                             <span className="text-xs font-black">{aiResult.score_confianza}%</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-indigo-600 text-white shadow-xl space-y-6">
                     <h4 className="text-lg font-black flex items-center gap-2">
                        <Zap size={20} /> Recommendations
                     </h4>
                     <div className="space-y-4">
                        {aiResult.recomendaciones.map((rec: string, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-indigo-500/20 rounded-2xl border border-white/10 hover:bg-indigo-500/30 transition-colors">
                             <div className="h-6 w-6 rounded-full bg-indigo-400 flex items-center justify-center shrink-0 text-[10px] font-black">
                               {i + 1}
                             </div>
                             <p className="text-xs font-bold leading-relaxed">{rec}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <button 
                  onClick={() => setAiResult(null)}
                  className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mx-auto block"
                >
                  Reiniciar Simulación
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
