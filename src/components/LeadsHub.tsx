import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, Phone, MapPin, Search, Filter, MoreHorizontal, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function LeadsHub() {
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    { id: 1, name: 'Marcos García', company: 'TechSolutions S.L.', email: 'm.garcia@techsolutions.es', industry: 'Software', status: 'new', score: 85 },
    { id: 2, name: 'Elena Rivas', company: 'GreenRetail', email: 'elena@greenretail.com', industry: 'E-commerce', status: 'contacted', score: 72 },
    { id: 3, name: 'Julio Sanz', company: 'Factory Plus', email: 'jsanz@factory.ie', industry: 'Industrial', status: 'converted', score: 98 },
    { id: 4, name: 'Laura Moar', company: 'Creative Lab', email: 'laura@clab.design', industry: 'Design', status: 'new', score: 64 },
    { id: 5, name: 'David Ortiz', company: 'NutriFit', email: 'david@nutrifit.mx', industry: 'Health', status: 'ignored', score: 21 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Clock size={10} /> Nuevo</span>;
      case 'contacted': return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Mail size={10} /> Contactado</span>;
      case 'converted': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 size={10} /> Convertido</span>;
      default: return <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><XCircle size={10} /> Ignorado</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, empresa o sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 py-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-11 px-4 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Filter size={16} /> Filtros
          </button>
          <button className="btn-primary h-11 px-6 shadow-lg shadow-indigo-600/10 font-bold uppercase tracking-widest text-[10px]">
            Descubrir Leads
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Lead</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Industria</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Estado</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Score IA</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead, i) => (
              <motion.tr 
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {lead.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{lead.name}</span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{lead.company}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{lead.industry}</span>
                  <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                    <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors"><Mail size={10} /> Email</span>
                    <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors"><Phone size={10} /> Call</span>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(lead.status)}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 w-24">
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${lead.score}%` }}
                        className={`h-full ${lead.score > 80 ? 'bg-indigo-600' : lead.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{lead.score}/100</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
