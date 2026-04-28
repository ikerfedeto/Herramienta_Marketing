/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Analyzer } from './components/Analyzer';
import { CreativeStudio } from './components/CreativeStudio';
import { ROICalculator } from './components/ROICalculator';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Connection test to avoid "client is offline" errors on startup
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              displayName: user.displayName,
              createdAt: serverTimestamp(),
              onboardingComplete: false
            });
          }
        } catch (error) {
          console.error("User doc init error", error);
        }
        setUser(user);
        setView('app');
      } else {
        setUser(null);
        if (view === 'app') setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  const handleLogout = async () => {
    await signOut(auth);
    setView('landing');
  };

  const navigateToAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setView('auth');
  };

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-indigo-600">
        <Sparkles size={48} />
      </motion.div>
      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Cargando MarketFlow AI...</span>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div 
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full"
        >
          <LandingPage 
            onGetStarted={() => navigateToAuth('register')} 
            onLogin={() => navigateToAuth('login')} 
          />
        </motion.div>
      )}

      {view === 'auth' && (
        <motion.div 
          key="auth"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Auth 
            initialMode={authMode} 
            onSuccess={() => setView('app')} 
          />
        </motion.div>
      )}

      {view === 'app' && user && (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user}>
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
              {activeTab === 'analyzer' && <Analyzer key="analyzer" />}
              {activeTab === 'creative' && <CreativeStudio key="creative" />}
              {activeTab === 'roi' && <ROICalculator key="roi" />}
            </AnimatePresence>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
