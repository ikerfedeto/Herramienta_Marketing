import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  auth,
} from '../lib/firebase';
import type { AuthMode } from '../types';
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
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

interface AuthProps {
  onSuccess: () => void;
  initialMode?: AuthMode;
  onBack?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, initialMode = 'login', onBack }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getFirebaseErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      'auth/user-not-found': 'No existe una cuenta con este email.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales inválidas. Verifica tu email y contraseña.',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El formato del email no es válido.',
      'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentarlo.',
      'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión.',
      'auth/unauthorized-domain': 'Este dominio no está autorizado para autenticación. Contacta al administrador.',
      'auth/operation-not-allowed': 'Este método de autenticación no está habilitado. Contacta al administrador.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
    };
    return messages[code] || 'Error de autenticación. Inténtalo de nuevo.';
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'register' && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      }
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
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
            {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'register' ? 'Crea tu cuenta' : 'Recuperar acceso'}
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-2">
            {mode === 'login' ? 'La inteligencia de mercado te está esperando.' : mode === 'register' ? 'Empieza a analizar dominios en segundos.' : 'Te enviaremos un enlace para resetear tu clave.'}
          </p>
        </div>

        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-slate-200 border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode !== 'forgot' && (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    <GoogleIcon />
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

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-semibold"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-xs font-bold"
                  >
                    <CheckCircle2 size={16} />
                    {success}
                  </motion.div>
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
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={mode === 'register' ? 6 : undefined}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-sm font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {mode === 'register' && password.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5 ml-1">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              password.length >= 8 ? 'w-full bg-emerald-500' :
                              password.length >= 6 ? 'w-2/3 bg-amber-500' :
                              'w-1/3 bg-red-500'
                            }`}
                          />
                        </div>
                        <span className={`text-[9px] font-bold uppercase ${
                          password.length >= 8 ? 'text-emerald-600' :
                          password.length >= 6 ? 'text-amber-600' :
                          'text-red-500'
                        }`}>
                          {password.length >= 8 ? 'Fuerte' : password.length >= 6 ? 'Media' : 'Débil'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {mode === 'login' ? 'Entrar ahora' : mode === 'register' ? 'Crear mi cuenta' : 'Resetear contraseña'}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center pt-6 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {mode === 'login' ? '¿Aún no tienes cuenta?' : mode === 'forgot' ? '¿Ya recuerdas tu clave?' : '¿Ya eres miembro?'}
                </p>
                <button
                  onClick={() => setMode(mode === 'forgot' ? 'login' : mode === 'login' ? 'register' : 'login')}
                  className="mt-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
           onClick={handleBack}
           className="mt-6 w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={12} />
          Volver a la Home
        </button>
      </motion.div>
    </div>
  );
};
