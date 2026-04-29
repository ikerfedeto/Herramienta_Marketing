import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Globe, Mail,
  AlertCircle, Loader2, Target, Zap, 
  Shield, Cpu, Phone, MapPin, 
  Activity, Sparkles, History, Clock,
  Trash2, ExternalLink
} from 'lucide-react';
import { analyzeBusiness } from '../services/geminiService';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import type { AnalysisHistoryItem } from '../types';

export function Analyzer() {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisHistoryItem | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [auth.currentUser]);

  const fetchHistory = async () => {
    if (!auth.currentUser) return;
    setLoadingHistory(true);
    try {
      const q = query(
        collection(db, 'analyses'),
        where('ownerId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as AnalysisHistoryItem[];
      setHistory(docs);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'analyses', id));
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!input && !description) {
      setError('Por favor, introduce una URL o descripción del negocio.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);
    setStep('Iniciando rastreo web...');

    try {
      setStep('Analizando con IA de Marketing...');
      const data = await analyzeBusiness(input, description);
      
      console.log('Análisis completado:', data);
      
      if (!data || !data.empresa) {
        throw new Error('La IA no pudo estructurar los datos del negocio.');
      }
      
      const analysisItem: AnalysisHistoryItem = { ...data, id: '', website: input, createdAt: new Date() };
      setResult(analysisItem);
      
      if (auth.currentUser) {
        const firestorePath = 'analyses';
        try {
          const docRef = await addDoc(collection(db, firestorePath), {
            ...data,
            website: input,
            ownerId: auth.currentUser.uid,
            createdAt: serverTimestamp()
          });
          
          const savedItem: AnalysisHistoryItem = { ...data, id: docRef.id, website: input, createdAt: new Date() };
          setResult(savedItem);
          setHistory(prev => [savedItem, ...prev.slice(0, 9)]);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, firestorePath);
        }
      }
    } catch (err) {
      console.error('Analyzer Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al analizar: ${errorMessage}. Revisa la URL o descripción.`);
    } finally {
      setAnalyzing(false);
      setStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-12 lg:gap-10">
      {/* Sidebar Historial */}
      <div className="hidden lg:block lg:col-span-3 space-y-6">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <History size={14} className="text-indigo-600" /> Historial Reciente
            </h3>
            <button onClick={fetchHistory} className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Activity size={12} className={loadingHistory ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 && !loadingHistory && (
              <div className="text-center py-8">
                <Clock size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Sin búsquedas previas</p>
              </div>
            )}
            
            {history.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setResult(item);
                  setInput(item.website || '');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group p-3 rounded-xl border transition-all cursor-pointer relative ${
                  result?.id === item.id 
                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-1 pr-6">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Globe size={10} className={result?.id === item.id ? 'text-indigo-200' : 'text-slate-400'} />
                    <span className={`text-[11px] font-black truncate uppercase tracking-tight ${result?.id === item.id ? 'text-white' : 'text-slate-700'}`}>
                      {item.empresa?.nombre || item.website || 'Negocio'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${result?.id === item.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      Score: {item.hot_lead_score}%
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => deleteHistoryItem(e, item.id)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                    result?.id === item.id ? 'text-indigo-200 hover:text-white' : 'text-slate-300 hover:text-rose-500'
                  }`}
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-600 text-white space-y-4">
           <Zap size={24} className="fill-current" />
           <p className="text-[11px] font-bold leading-relaxed opacity-90">
             ¿Sabías que el historial se sincroniza en todos tus dispositivos? Nunca pierdas una oportunidad.
           </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="lg:col-span-9 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
            <Shield size={12} /> GDPR Compliant Scraping
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Deep <span className="text-indigo-600">Scraper</span> & Business Intel</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Motor avanzado de extracción de datos y detección de oportunidades. Escanea el ADN digital de cualquier empresa en segundos.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Punto de Entrada (URL / Empresa)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="ejemplo.com o Nombre de Marca"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input-field pl-12 h-14 text-base font-medium border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Filtro de Inteligencia</label>
                <textarea 
                  placeholder="¿Qué insights específicos buscas? (Ej: Gaps en SEO, Tech Stack)"
                  rows={1}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field py-4 min-h-[56px] resize-none border-slate-200 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center gap-3 text-base font-bold shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" size={22} /> 
                  <span className="animate-pulse">{step}</span>
                </>
              ) : (
                <>
                  <Zap size={22} className="fill-current" /> Ejecutar Deep Scraping IA
                </>
              )}
            </button>
            
            {result && (
              <button 
                onClick={() => { setResult(null); setInput(''); setDescription(''); }}
                className="px-6 h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center transition-all"
                title="Limpiar"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{error}</span>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-12"
            >
            {/* Cabecera de Inteligencia */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm md:col-span-9 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{result?.empresa?.nombre}</h3>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={12} className="text-indigo-500" /> {result?.empresa?.localizacion}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold italic text-balance">
                    "{result?.empresa?.resumen}"
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group md:col-span-3">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Lead Intent</p>
                 <p className="text-6xl font-black text-white group-hover:scale-110 transition-transform">
                   {result?.hot_lead_score}<span className="text-2xl text-slate-600">%</span>
                 </p>
                 <div className="mt-4 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Score de Calidad</p>
                 </div>
              </div>
            </div>

            {/* Grid de Métricas y Tecnología */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} className="text-indigo-600" /> Stack & Security
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium border-b border-slate-50 pb-2">
                    <span className="text-slate-500">CMS:</span>
                    <span className="text-slate-900 font-bold truncate ml-2 text-right">{result?.tecnologia?.cms}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">SSL / Seguridad:</span>
                    <span className={result?.tecnologia?.seguridad_ssl ? 'text-green-600 font-bold' : 'text-red-400 font-bold'}>
                      {result?.tecnologia?.seguridad_ssl ? 'Protegido' : 'Vulnerable'}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">GDPR Compliance</p>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                      result?.tecnologia?.cumplimiento_gdpr === 'alto' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>{result?.tecnologia?.cumplimiento_gdpr}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-pink-600" /> Growth Signals
                </h4>
                <div className="space-y-4 overflow-hidden">
                  <div className={`p-2 rounded border ${result?.senales_crecimiento?.contratacion_activa ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Contratación</p>
                    <p className="text-[11px] font-bold text-slate-700 break-words">
                      {result?.senales_crecimiento?.contratacion_activa ? 'Detectada (Hiring)' : 'No detectada'}
                    </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Expansión</p>
                     <p className="text-[11px] font-medium text-slate-600 break-words">{result?.senales_crecimiento?.expansion_geografica}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} className="text-emerald-600" /> Marketing Intensity
                </h4>
                <div className="space-y-4 overflow-hidden">
                   <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-slate-400">SEO Health</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result?.marketing_intensity?.seo_score || 0}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Facebook/Google Ads:</span>
                    <span className="text-xs font-semibold text-slate-900 break-words leading-tight">{result?.marketing_intensity?.ads_presence}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-indigo-600" /> Contact Info
                </h4>
                <div className="space-y-2 overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 break-all">
                    <Mail size={12} className="text-slate-300 shrink-0" /> {result?.contacto?.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Phone size={12} className="text-slate-300 shrink-0" /> {result?.contacto?.telefono || 'N/A'}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result?.contacto?.rrss?.slice(0, 3).map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-black text-slate-400 uppercase">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Hypothesis Section */}
            <div className="p-8 rounded-2xl bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Sparkles size={120} />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="space-y-3 flex-1 min-w-0">
                     <h4 className="text-xl font-black tracking-tight break-words">Growth Hypothesis: <span className="text-indigo-200">{result?.hipotesis_crecimiento?.problema_raiz}</span></h4>
                     <p className="text-sm font-medium text-indigo-50 leading-relaxed max-w-2xl break-words">
                       {result?.hipotesis_crecimiento?.solucion_propuesta}
                     </p>
                  </div>
                  <button className="md:ml-auto shrink-0 px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                    Activar Estrategia
                  </button>
               </div>
            </div>

            {/* Oportunidades Críticas */}
            <div className="p-8 rounded-xl bg-slate-900 text-white shadow-xl">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Zap size={14} /> Gaps y Oportunidades Críticas
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {result?.analisis_oportunidades?.map((op, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors min-w-0">
                      <div className="flex justify-between items-center mb-2 gap-2">
                         <span className="text-[9px] font-black text-indigo-300 uppercase truncate">{op.area}</span>
                         <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                           op.prioridad === 'alta' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                         }`}>{op.prioridad}</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-2 break-words leading-tight">{op.hallazgo}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic break-words">"Ideal para vender: {op.oportunidad}"</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Outreach Material */}
            <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Target size={14} className="text-indigo-600" /> Material de Prospección Sugerido
               </h4>
               <div className="space-y-6">
                 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative group">
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="p-1.5 bg-white border border-slate-200 rounded-md hover:text-indigo-600 transition-colors">
                         <ExternalLink size={14} />
                       </button>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Asunto del Email</p>
                    <p className="text-sm font-bold text-slate-900 mb-4">{result?.outreach_automatizado?.email_asunto}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Cuerpo de la Propuesta</p>
                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                      {result?.outreach_automatizado?.email_cuerpo}
                    </div>
                 </div>
                 
                 <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <p className="text-[10px] font-bold text-indigo-100 uppercase mb-2">Mensaje de LinkedIn (Ice-breaker)</p>
                    <p className="text-sm font-medium italic">"{result?.outreach_automatizado?.linkedin_invite}"</p>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
