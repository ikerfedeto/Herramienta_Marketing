import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Mail, Palette, Megaphone, Loader2, Copy, Check, ImageIcon, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateMarketingAsset, generateCreativeImage } from '../services/geminiService';
import type { BusinessInfo } from '../types';

export function CreativeStudio() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({ name: '', valueProposition: '', sector: '' });
  const [selectedType, setSelectedType] = useState('slogan');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generateWithImage, setGenerateWithImage] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generators = [
    { id: 'slogan', label: 'Eslóganes', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
    { id: 'social_post', label: 'Social Media', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50/50' },
    { id: 'newsletter', label: 'Email Marketing', icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
    { id: 'concept_logo', label: 'Branding', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50/50' },
  ];

  const handleGenerate = async () => {
    if (!businessInfo.name) return;
    setGenerating(true);
    setResult('');
    setImageUrl(null);
    setError(null);
    try {
      const [content, img] = await Promise.all([
        generateMarketingAsset(businessInfo, selectedType),
        generateWithImage ? generateCreativeImage(businessInfo, selectedType) : Promise.resolve(null)
      ]);
      setResult(content || '');
      setImageUrl(img);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar contenido. Inténtalo de nuevo.';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `creative-asset-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Panel */}
        <div className="md:w-1/3 space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-slate-800">
              <Sparkles className="text-indigo-600" size={18} /> Configuración
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 block">Nombre Negocio</label>
                <input 
                  type="text" 
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  className="input-field"
                  placeholder="Ej: EcoShoes"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 block">Sector</label>
                <select
                  value={businessInfo.sector}
                  onChange={(e) => setBusinessInfo({...businessInfo, sector: e.target.value})}
                  className="input-field"
                >
                  <option value="">Seleccionar sector...</option>
                  <option value="SaaS">SaaS / Software</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Inmobiliaria">Inmobiliaria</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Hostelería">Hostelería</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="General">General / Otro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 block">Propuesta de Valor</label>
                <textarea 
                  value={businessInfo.valueProposition}
                  onChange={(e) => setBusinessInfo({...businessInfo, valueProposition: e.target.value})}
                  className="input-field h-24 resize-none"
                  placeholder="Ej: Calzado fabricado con plástico reciclado del océano."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => setGenerateWithImage(!generateWithImage)}
                  className={`w-full py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    generateWithImage ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <ImageIcon size={14} />
                  {generateWithImage ? 'Generar con Imagen' : 'Solo Texto'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {generators.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setSelectedType(gen.id)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${
                  selectedType === gen.id 
                    ? 'bg-indigo-50 border-indigo-200 ' + gen.color
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <gen.icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{gen.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={generating || !businessInfo.name}
            className="btn-primary w-full h-12 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Generar Contenido
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 flex flex-col p-8 rounded-xl bg-white border border-slate-200 shadow-sm min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold uppercase tracking-widest text-[10px] text-slate-400 font-mono">Resultado IA</h3>
            {result && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'COPIADO!' : 'COPIAR'}
              </button>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-semibold"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full"
                    />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
                    {generateWithImage ? 'Creando arte y texto...' : 'Redactando...'}
                  </p>
                </motion.div>
              ) : (result || imageUrl) ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {imageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg aspect-square max-w-sm mx-auto group"
                    >
                      <img src={imageUrl} alt="Contenido creativo generado por IA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={downloadImage} 
                        className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        Descargar
                      </button>
                    </motion.div>
                  )}
                  {result && (
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 font-medium leading-relaxed">
                      <div className="markdown-body">
                        <ReactMarkdown>{result}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                  <Sparkles size={64} className="mb-4 opacity-10" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Selecciona y genera contenido</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
