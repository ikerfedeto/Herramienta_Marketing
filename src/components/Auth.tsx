import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Chrome
} from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('¡Email de recuperación enviado! Revisa tu bandeja de entrada.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 mb-4">
            <Sparkles className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'register' ? 'Crea tu cuenta IA' : 'Recuperar acceso'}
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-2">
            {mode === 'login' ? 'La inteligencia de mercado te está esperando.' : mode === 'register' ? 'Empieza a analizar dominios en segundos.' : 'Te enviaremos un enlace para resetear tu clave.'}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Social Login */}
              {mode !== 'forgot' && (
                <>
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm shadow-sm active:scale-[0.98]"
                  >
                    <Chrome size={18} className="text-blue-500" />
                    Continuar con Google
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-300">
                      <span className="bg-white px-4">O usa tu email</span>
                    </div>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 size={16} />
                    {success}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email"
                      required
                      placeholder="hola@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest"
                        >
                          ¿Olvidaste tu clave?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-sm font-medium text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : mode === 'login' ? 'Entrar ahora' : mode === 'register' ? 'Crear mi cuenta' : 'Resetear contraseña'}
                  {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              {/* Toggles */}
              <div className="mt-8 text-center pt-6 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya eres miembro?'}
                </p>
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="mt-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
           onClick={() => window.location.href = '/'}
           className="mt-8 w-full text-center text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 transition-colors"
        >
          ← Volver a la Home
        </button>
      </motion.div>
    </div>
  );
};
