import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import type { AppUser } from '../types';

interface SettingsProps {
  user: AppUser;
}

export function Settings({ user }: SettingsProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!auth.currentUser || !currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setChangingPassword(true);
    setError('');
    setSuccess('');
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setSuccess('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('La contraseña actual es incorrecta.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const isEmailUser = auth.currentUser?.providerData.some(p => p.providerId === 'password');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 pb-12"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Ajustes de Cuenta</h2>
        <p className="text-sm text-slate-500 font-medium">Gestiona tu perfil y preferencias.</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-sm font-semibold">
          <CheckCircle2 size={18} /> {success}
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
          <AlertCircle size={18} /> {error}
        </motion.div>
      )}

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <User size={18} className="text-indigo-600" /> Perfil
        </h3>

        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=4f46e5&color=fff&bold=true`}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl border-2 border-slate-200 object-cover"
          />
          <div>
            <p className="font-bold text-slate-900">{user.displayName || 'Sin nombre'}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nombre</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="input-field bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              {user.emailVerified && (
                <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Shield size={14} /> Verificado
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={saving || displayName === user.displayName}
            className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Password Section (only for email users) */}
      {isEmailUser && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield size={18} className="text-indigo-600" /> Cambiar Contraseña
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Contraseña Actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !currentPassword || !newPassword}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </div>
      )}

      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Clock size={18} className="text-indigo-600" /> Información de Cuenta
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500 font-medium">ID de usuario</span>
            <span className="text-slate-900 font-mono text-xs">{user.uid.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500 font-medium">Proveedor de auth</span>
            <span className="text-slate-900 font-medium flex items-center gap-1">
              <Mail size={14} className="text-indigo-600" />
              {auth.currentUser?.providerData.map(p => p.providerId === 'google.com' ? 'Google' : 'Email').join(', ')}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500 font-medium">Plan</span>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">Starter (Gratis)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
