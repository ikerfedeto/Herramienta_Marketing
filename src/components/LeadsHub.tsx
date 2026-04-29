import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Globe, MapPin, Zap, Loader2, ArrowRight, Target } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface LeadFromAnalysis {
  id: string;
  empresa?: { nombre?: string; sector?: string; localizacion?: string };
  hot_lead_score?: number;
  website?: string;
  contacto?: { email?: string; telefono?: string };
  createdAt?: { seconds: number } | Date;
}

export function LeadsHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<LeadFromAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    if (!auth.currentUser) { setLoading(false); return; }
    try {
      const q = query(
        collection(db, 'analyses'),
        where('ownerId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as LeadFromAnalysis)));
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: 'Caliente', color: 'text-emerald-600 bg-emerald-50' };
    if (score >= 40) return { label: 'Tibio', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Frío', color: 'text-slate-500 bg-slate-100' };
  };

  const filteredLeads = leads.filter(lead => {
    const score = lead.hot_lead_score ?? 0;
    const matchesSearch = !searchTerm || 
      (lead.empresa?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.empresa?.sector?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.website?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' ||
      (filter === 'hot' && score >= 70) ||
      (filter === 'warm' && score >= 40 && score < 70) ||
      (filter === 'cold' && score < 40);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Centro de Leads</h2>
        <p className="text-sm text-slate-500 font-medium">
          {leads.length === 0
            ? 'Aquí aparecerán los leads de tus análisis.'
            : `${leads.length} ${leads.length === 1 ? 'lead detectado' : 'leads detectados'} en tus análisis.`}
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16">
          <Target size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-lg font-bold text-slate-400 mb-2">Sin leads todavía</p>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Los leads se generan automáticamente cuando analizas dominios con el Analizador. Cada análisis se convierte en un lead con su score de calidad.
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, sector o URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 py-3 w-full"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all' as const, label: 'Todos' },
                { key: 'hot' as const, label: 'Calientes' },
                { key: 'warm' as const, label: 'Tibios' },
                { key: 'cold' as const, label: 'Fríos' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-2xl font-black text-emerald-600">{leads.filter(l => (l.hot_lead_score ?? 0) >= 70).length}</p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Calientes</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-2xl font-black text-amber-600">{leads.filter(l => (l.hot_lead_score ?? 0) >= 40 && (l.hot_lead_score ?? 0) < 70).length}</p>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tibios</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-2xl font-black text-slate-500">{leads.filter(l => (l.hot_lead_score ?? 0) < 40).length}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fríos</p>
            </div>
          </div>

          {/* Leads List */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Search size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">Sin resultados para esta búsqueda.</p>
              </div>
            ) : (
              filteredLeads.map((lead, i) => {
                const score = lead.hot_lead_score ?? 0;
                const scoreInfo = getScoreLabel(score);
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {(lead.empresa?.nombre || lead.website || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 truncate">
                            {lead.empresa?.nombre || 'Sin nombre'}
                          </p>
                          <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${scoreInfo.color}`}>
                            {scoreInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          {lead.empresa?.sector && (
                            <span className="flex items-center gap-1">
                              <Zap size={12} /> {lead.empresa.sector}
                            </span>
                          )}
                          {lead.empresa?.localizacion && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {lead.empresa.localizacion}
                            </span>
                          )}
                          {lead.website && (
                            <span className="flex items-center gap-1">
                              <Globe size={12} /> {lead.website}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className={`text-xl font-black ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {score}%
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {lead.contacto?.email && (
                            <a
                              href={`mailto:${lead.contacto.email}`}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              Email <ArrowRight size={10} />
                            </a>
                          )}
                          {lead.website && (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              Web <ArrowRight size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
