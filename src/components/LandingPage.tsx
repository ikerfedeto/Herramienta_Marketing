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
  Brain,
  Star,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">MarketFlow<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Cómo funciona</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Precios</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
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
      <section className="pt-28 sm:pt-32 pb-20 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Plataforma IA activa</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-slate-950 leading-[0.9] mb-6">
              Inteligencia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Marketing</span> con IA.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              Analiza cualquier dominio en segundos. Obtén informes de oportunidad, genera contenido profesional y predice tu ROI con datos reales de mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Empezar gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
              >
                <span className="text-sm font-bold text-slate-700">Ya tengo cuenta</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">Herramienta #1 para agencias y consultoras de marketing</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 p-4 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
               <div className="bg-slate-950 rounded-[1.5rem] p-8 aspect-video flex flex-col justify-center items-center text-center">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
                    <Brain className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Analizando dominio...</h3>
                  <p className="text-slate-400 text-sm font-medium mb-4">Escaneando tecnología, SEO, ads y oportunidades</p>
                  <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Funcionalidades</h2>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">Todo lo que necesitas para escalar tu estrategia de marketing.</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Desde el análisis de competencia hasta la generación de contenido y predicción de ROI. Todo en una sola plataforma.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Zap className="text-amber-500" />,
                title: 'Análisis de Tecnología',
                desc: 'Identificamos CMS, CRM, píxeles de seguimiento y herramientas de marketing de cualquier dominio.'
              },
              {
                icon: <Target className="text-indigo-600" />,
                title: 'Ganchos de Venta con IA',
                desc: 'Generamos frases de apertura y argumentos de venta basados en los puntos débiles reales del negocio.'
              },
              {
                icon: <BarChart3 className="text-emerald-500" />,
                title: 'Intensidad de Marketing',
                desc: 'Medimos inversión en publicidad, presencia SEO y velocidad de contenido para identificar oportunidades.'
              },
              {
                icon: <ShieldCheck className="text-blue-500" />,
                title: 'Auditoría de Seguridad',
                desc: 'Analizamos SSL, velocidad de carga y cumplimiento RGPD para ofrecer mejoras inmediatas al cliente.'
              },
              {
                icon: <Users className="text-pink-500" />,
                title: 'Enriquecimiento de Leads',
                desc: 'Extraemos datos de contacto, redes sociales y señales de crecimiento para cada empresa analizada.'
              },
              {
                icon: <LineChart className="text-purple-600" />,
                title: 'Predicción de ROI',
                desc: 'Calculamos el retorno de inversión con benchmarks reales del sector y tres escenarios de proyección.'
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-slate-950 mb-3">{f.title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-20 sm:py-32 rounded-[2rem] sm:rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Testimonios</h2>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Lo que dicen nuestros <span className="text-indigo-600">usuarios</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'Antes tardaba horas en preparar una propuesta. Ahora, en lo que mi cliente me dice hola, ya tengo su auditoría lista. Mi tasa de cierre ha subido de forma radical.',
                name: 'Carlos M.',
                role: 'Director Comercial, Agencia Digital',
                stars: 5
              },
              {
                quote: 'El generador de contenido es brutal. Creo newsletters y posts para mis clientes en minutos en vez de horas. La calidad del copy con IA es impresionante.',
                name: 'Laura R.',
                role: 'Consultora de Marketing',
                stars: 5
              },
              {
                quote: 'El predictor de ROI me ayuda a justificar presupuestos con datos reales. Mis clientes confían más en mis propuestas desde que les muestro los escenarios.',
                name: 'Miguel A.',
                role: 'Growth Manager, SaaS B2B',
                stars: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, j) => (
                      <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-700 italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=4f46e5&color=fff&bold=true&size=48`}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs font-medium text-indigo-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              'Cierra un 35% más de reuniones en frío.',
              'Posiciónate como experto técnico al instante.',
              'Identifica oportunidades que el cliente ni conoce.',
              'Ahorra 2 horas de investigación por cada lead.'
            ].map((txt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="text-emerald-500" size={24} />
                <span className="font-bold text-slate-700 text-sm">{txt}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Precios</h2>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Un plan para cada etapa de tu negocio
            </h3>
            <p className="text-slate-600 font-medium">
              Empieza gratis y escala cuando lo necesites. Sin permanencia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <h4 className="text-lg font-black text-slate-900 mb-1">Starter</h4>
              <p className="text-sm text-slate-500 font-medium mb-6">Para probar la plataforma</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">Gratis</span>
              </div>
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all mb-8"
              >
                Crear cuenta gratis
              </button>
              <div className="space-y-3">
                {[
                  '5 análisis de dominio al mes',
                  '10 generaciones de contenido',
                  'Calculadora de ROI básica',
                  'Historial de 30 días',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-black">Pro</h4>
                  <span className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">Popular</span>
                </div>
                <p className="text-sm text-slate-400 font-medium mb-6">Para profesionales y freelancers</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">€49</span>
                  <span className="text-slate-400 font-medium">/mes</span>
                </div>
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 mb-8"
                >
                  Empezar prueba gratuita
                </button>
                <div className="space-y-3">
                  {[
                    '50 análisis de dominio al mes',
                    'Generaciones ilimitadas de contenido',
                    'Predictor de ROI avanzado (3 escenarios)',
                    'Centro de Leads con filtros',
                    'Exportar informes',
                    'Historial ilimitado',
                    'Soporte prioritario',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={16} className="text-indigo-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Agency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <h4 className="text-lg font-black text-slate-900 mb-1">Agencia</h4>
              <p className="text-sm text-slate-500 font-medium mb-6">Para equipos y agencias</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">€149</span>
                <span className="text-slate-400 font-medium">/mes</span>
              </div>
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all mb-8"
              >
                Contactar ventas
              </button>
              <div className="space-y-3">
                {[
                  'Análisis ilimitados',
                  'Todo lo de Pro incluido',
                  'Hasta 5 miembros del equipo',
                  'Informes con marca blanca',
                  'API de integración',
                  'Onboarding personalizado',
                  'Gestor de cuenta dedicado',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 sm:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Metodología</h2>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">De un dominio a una <span className="text-indigo-400">estrategia ganadora</span> en 3 pasos.</h3>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 relative">
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent -translate-y-1/2"></div>

             {[
               {
                 step: '01',
                 title: 'Introduce el Dominio',
                 desc: 'Solo necesitas la URL del sitio web de tu lead o posible cliente. Sin integraciones ni configuración.',
                 icon: <Target className="text-white" size={24} />
               },
               {
                 step: '02',
                 title: 'Análisis con IA',
                 desc: 'Nuestra IA analiza el stack técnico, la intensidad de marketing, gaps de seguridad y genera ganchos de venta.',
                 icon: <Brain className="text-white" size={24} />
               },
               {
                 step: '03',
                 title: 'Cierra la Venta',
                 desc: 'Recibe un informe accionable con frases de apertura personalizadas y ROI estimado para tu propuesta.',
                 icon: <Zap className="text-white" size={24} />
               }
             ].map((s, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.15 }}
                 className="relative group"
               >
                  <div className="mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                      {s.icon}
                    </div>
                    <div className="absolute -top-4 -right-4 text-4xl font-black text-white/5">{s.step}</div>
                  </div>
                  <h4 className="text-2xl font-black mb-4">{s.title}</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">{s.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-80 h-80 border-[40px] border-white rounded-full"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[40px] border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-6 sm:mb-8">
                ¿Listo para dominar tu mercado?
              </h2>
              <p className="text-indigo-100 text-base sm:text-lg md:text-xl font-medium mb-8 sm:mb-12 max-w-2xl mx-auto">
                Únete a los profesionales y agencias que ya usan la IA para ganar la batalla del lead.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="px-10 py-5 bg-white text-indigo-600 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                >
                  Empezar gratis
                </button>
                <button
                  onClick={onLogin}
                  className="px-10 py-5 bg-white/10 text-white font-black text-sm uppercase tracking-widest border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  Ya tengo cuenta
                </button>
              </div>
              <p className="mt-8 text-indigo-200 text-xs font-bold uppercase tracking-widest">Sin tarjeta de crédito · Sin permanencia · Cumplimiento RGPD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900">MarketFlow<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contacto</a>
          </div>
          <p className="text-xs font-bold text-slate-400">© {new Date().getFullYear()} MarketFlow AI</p>
        </div>
      </footer>
    </div>
  );
};
