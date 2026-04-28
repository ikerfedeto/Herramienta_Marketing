import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Users,
  LineChart,
  Brain
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">Marketix<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Cómo funciona</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Iniciar sesión
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-slate-950 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Comenzar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">IA Intelligence v2.0 is live</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-950 leading-[0.9] mb-6">
              Auditoría de <span className="text-indigo-600">Marketing</span> impulsada por IA.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              Analiza cualquier dominio en segundos. Obtén insights profundos, stacks tecnológicos y estrategias de crecimiento personalizadas para cerrar más leads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Comenzar ahora
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200 rounded-2xl">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">+2.4k marketers confiando</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 p-4 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
               <div className="bg-slate-950 rounded-[1.5rem] p-6 aspect-video flex flex-col justify-center items-center text-center">
                  <div className="p-4 bg-indigo-600 rounded-2xl mb-4 animate-bounce">
                    <Brain className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Processing Lead Domain...</h3>
                  <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/2 h-full bg-indigo-500"
                    />
                  </div>
               </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Dominios Analizados', val: '12k+' },
              { label: 'ROI Promedio', val: 'x2.4' },
              { label: 'Tiempo de Análisis', val: '4.2s' },
              { label: 'Confianza', val: '99%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-white mb-1">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Superpoderes</h2>
            <h3 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Auditorías que parecen magia, pero son inteligencia.</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Hemos entrenado nuestro modelo con miles de estrategias ganadoras para que tú solo tengas que introducir un dominio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-amber-500" />,
                title: 'Tech Stack Discovery',
                desc: 'Identificamos CMS, CRM, píxeles de trackeo y herramientas de marketing que usa tu cliente ideal.'
              },
              {
                icon: <Target className="text-indigo-600" />,
                title: 'Sales Hooks AI',
                desc: 'Generamos frases de apertura y ganchos de venta basados en los puntos débiles reales del dominio.'
              },
              {
                icon: <BarChart3 className="text-emerald-500" />,
                title: 'Market Intensity',
                desc: 'Medimos el nivel de inversión en Ads y presencia SEO para saber dónde atacar exactamente.'
              },
              {
                icon: <ShieldCheck className="text-blue-500" />,
                title: 'Security Audit',
                desc: 'Analizamos SSL, velocidad de carga y cumplimiento básico para ofrecer mejoras inmediatas.'
              },
              {
                icon: <Users className="text-pink-500" />,
                title: 'Lead Enrichment',
                desc: 'Extraemos correos, redes sociales y contacto para que no pierdas tiempo buscando.'
              },
              {
                icon: <LineChart className="text-purple-600" />,
                title: 'Growth Roadmap',
                desc: 'Un plan paso a paso de lo que el dominio necesita para doblar su tasa de conversión.'
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-slate-950 mb-3">{f.title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Results */}
      <section className="bg-slate-50 py-32 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h3 className="text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                No es solo una auditoría, es tu próxima <span className="text-indigo-600">oportunidad de cierre.</span>
              </h3>
              <div className="space-y-4">
                {[
                  'Cierra un 35% más de reuniones en frío.',
                  'Posiciónate como un experto técnico al instante.',
                  'Identifica oportunidades que el cliente ni conoce.',
                  'Ahorra 2 horas de investigación por cada lead.'
                ].map((txt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="font-bold text-slate-700">{txt}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" alt="Testimonial" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Carlos Méndez</p>
                      <p className="text-xs font-bold text-indigo-600">Head of Sales @ GrowthX</p>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-slate-700 italic leading-relaxed">
                    "Antes tardaba horas en preparar una propuesta. Ahora, en lo que mi cliente me dice hola, ya tengo su auditoría lista. Mi tasa de cierre ha subido de forma radical."
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-80 h-80 border-[40px] border-white rounded-full"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[40px] border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                ¿Listo para dominar tu mercado?
              </h2>
              <p className="text-indigo-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                Únete a los mejores marketers y agencias que ya están usando la IA para ganar la batalla del lead.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onGetStarted}
                  className="px-10 py-5 bg-white text-indigo-600 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                >
                  Registrarme gratis
                </button>
                <button 
                  onClick={onLogin}
                  className="px-10 py-5 bg-indigo-500/50 text-white font-black text-sm uppercase tracking-widest border border-white/20 rounded-2xl hover:bg-indigo-500 transition-all"
                >
                  Hablar con un experto
                </button>
              </div>
              <p className="mt-8 text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em]">No credit card required • GDPR Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900">Marketix<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900">Privacidad</a>
            <a href="#" className="hover:text-slate-900">Términos</a>
            <a href="#" className="hover:text-slate-900">Contacto</a>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 Marketix AI. Intelligence for Scale.</p>
        </div>
      </footer>
    </div>
  );
};
