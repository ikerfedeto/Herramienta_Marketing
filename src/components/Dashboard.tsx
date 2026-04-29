import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search, Sparkles, TrendingUp, Target,
  ArrowRight, BarChart3, Clock, Zap,
  FileText, Users, PenTool, Calculator,
  ChevronRight, CheckCircle2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer, doc, getDoc, updateDoc } from 'firebase/firestore';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

interface RecentAnalysis {
  id: string;
  empresa?: { nombre?: string; sector?: string };
  hot_lead_score?: number;
  website?: string;
  createdAt?: { seconds: number } | Date;
}

const ONBOARDING_STEPS = [
  {
    id: 'analyze',
    title: 'Analiza tu primer dominio',
    description: 'Introduce la URL de cualquier empresa y obtén un informe completo de marketing intelligence en segundos.',
    icon: Search,
    tab: 'analyzer',
    cta: 'Ir al Analizador',
  },
  {
    id: 'create',
    title: 'Genera contenido de marketing',
    description: 'Crea eslóganes, posts para redes sociales, newsletters y kits de branding con IA.',
    icon: PenTool,
    tab: 'creative',
    cta: 'Abrir Estudio Creativo',
  },
  {
    id: 'calculate',
    title: 'Calcula tu ROI',
    description: 'Simula el retorno de inversión de tus campañas con benchmarks reales por sector.',
    icon: Calculator,
    tab: 'roi',
    cta: 'Calcular ROI',
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const [analysisCount, setAnalysisCount] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!auth.currentUser) { setLoading(false); return; }
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setOnboardingComplete(userDoc.data().onboardingComplete !== false);
      }

      const analysesRef = collection(db, 'analyses');
      const countQuery = query(analysesRef, where('ownerId', '==', auth.currentUser.uid));

      const [countSnap, recentSnap] = await Promise.all([
        getCountFromServer(countQuery),
        getDocs(query(analysesRef, where('ownerId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'), limit(5)))
      ]);

      setAnalysisCount(countSnap.data().count);
      setRecentAnalyses(recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as RecentAnalysis)));

      if (countSnap.data().count > 0 && !userDoc.data()?.onboardingComplete) {
        setOnboardingComplete(true);
      }
    } catch (err) {
      console.error('Dashboard data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!auth.currentUser) return;
    setOnboardingComplete(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { onboardingComplete: true });
    } catch (err) {
      console.error('Onboarding update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const showOnboarding = !onboardingComplete && analysisCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
          {showOnboarding ? 'Bienvenido a MarketFlow AI' : 'Panel de Control'}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {showOnboarding
            ? 'Completa estos 3 pasos para sacar el máximo partido a la plataforma.'
            : `Tienes ${analysisCount} ${analysisCount === 1 ? 'análisis realizado' : 'análisis realizados'}.`}
        </p>
      </div>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="space-y-4">
          {ONBOARDING_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-5">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <step.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">Paso {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">{step.description}</p>
                  <button
                    onClick={() => onNavigate(step.tab)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    {step.cta} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <button
            onClick={completeOnboarding}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
          >
            Saltar onboarding
          </button>
        </div>
      )}

      {/* Dashboard with real data */}
      {!showOnboarding && (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Nuevo Análisis', icon: Search, tab: 'analyzer', color: 'from-indigo-600 to-indigo-700' },
              { label: 'Crear Contenido', icon: PenTool, tab: 'creative', color: 'from-purple-600 to-purple-700' },
              { label: 'Calcular ROI', icon: TrendingUp, tab: 'roi', color: 'from-emerald-600 to-emerald-700' },
              { label: 'Ver Leads', icon: Users, tab: 'leads', color: 'from-amber-600 to-amber-700' },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onNavigate(action.tab)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group`}
              >
                <action.icon size={22} className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-bold uppercase tracking-wider text-left">{action.label}</p>
              </motion.button>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <FileText size={18} className="text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Análisis Totales</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{analysisCount}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Target size={18} className="text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leads Detectados</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{recentAnalyses.filter(a => (a.hot_lead_score ?? 0) >= 60).length}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">con score {'>'} 60%</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <BarChart3 size={18} className="text-purple-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Medio</span>
              </div>
              <p className="text-4xl font-black text-slate-900">
                {recentAnalyses.length > 0
                  ? Math.round(recentAnalyses.reduce((sum, a) => sum + (a.hot_lead_score ?? 0), 0) / recentAnalyses.length)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                Análisis Recientes
              </h3>
              {analysisCount > 0 && (
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  Ver todos <ChevronRight size={14} />
                </button>
              )}
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400 mb-2">Sin análisis todavía</p>
                <p className="text-xs text-slate-400 mb-6">Analiza tu primer dominio para empezar a generar insights.</p>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all"
                >
                  <Zap size={14} /> Analizar Dominio
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((analysis, i) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onNavigate('analyzer')}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                      {(analysis.empresa?.nombre || analysis.website || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                        {analysis.empresa?.nombre || analysis.website || 'Análisis sin nombre'}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {analysis.empresa?.sector || 'Sin sector'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className={`text-sm font-black ${(analysis.hot_lead_score ?? 0) >= 70 ? 'text-emerald-600' : (analysis.hot_lead_score ?? 0) >= 40 ? 'text-amber-600' : 'text-slate-400'}`}>
                          {analysis.hot_lead_score ?? 0}%
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Consejo Pro</h4>
                <p className="text-sm text-indigo-100 font-medium">
                  Usa el <button onClick={() => onNavigate('analyzer')} className="underline font-bold text-white hover:text-indigo-200">Analizador</button> para escanear los dominios de tus competidores y descubrir gaps en su estrategia digital que puedes explotar.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('creative')}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-purple-600" />
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Estudio Creativo</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Genera eslóganes, posts y newsletters optimizados con IA para tu marca.</p>
            </button>
            <button
              onClick={() => onNavigate('roi')}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Predictor de ROI</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Simula escenarios de inversión y predice resultados con benchmarks reales.</p>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
