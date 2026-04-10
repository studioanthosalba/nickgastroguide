'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Store, TrendingUp, ArrowRight, ArrowLeft,
  Loader2, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loginAs = searchParams.get('as'); // null | 'ristoratore' | 'agent' | 'admin'
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login for:", email, "as:", loginAs);
      const { data, error: authError } = await insforge.auth.signInWithPassword({ email, password });
      
      if (authError) throw authError;

      if (data?.accessToken) {
        const normalizedEmail = email.toLowerCase().trim();

        // Admins can access any area
        if (ADMIN_EMAILS.includes(normalizedEmail)) {
          if (loginAs === 'agent') {
            window.location.href = '/agent-dashboard';
          } else if (loginAs === 'ristoratore') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/nick-secret-admin';
          }
          return;
        }

        // Fetch the user's actual role to validate access
        const { data: userRow } = await insforge.database
          .from('users')
          .select('is_agent')
          .eq('email', normalizedEmail)
          .single();

        const isAgent = userRow?.is_agent ?? false;

        if (loginAs === 'agent' && !isAgent) {
          await insforge.auth.signOut();
          throw new Error('Questo account è registrato come ristoratore. Accedi dall\'area ristoratori.');
        }

        if (loginAs === 'ristoratore' && isAgent) {
          await insforge.auth.signOut();
          throw new Error('Questo account è registrato come agente. Accedi dall\'area agenti.');
        }

        // Route to the correct dashboard
        window.location.href = isAgent ? '/agent-dashboard' : '/dashboard';
      }
    } catch (err: any) {
      console.error("Login component error:", err);
      setError(err.message || 'Errore durante l\'accesso. Verifica le credenziali.');
    } finally {
      setIsLoading(false);
    }
  };

  // Choice Screen
  if (!loginAs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex"
            >
              <Sparkles className="w-12 h-12 text-amber-500 mb-4" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Benvenuto su GastroGuide
            </h1>
            <p className="text-gray-500 text-lg">Scegli come vuoi accedere</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ristoratore Card */}
            <motion.button
              onClick={() => router.push('/login?as=ristoratore')}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(59,130,246,0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-left transition-all hover:border-blue-300 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ristoratore</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Gestisci il tuo ristorante, il menu e le prenotazioni
              </p>
              <span className="text-blue-600 font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Accedi <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>

            {/* Agente Card */}
            <motion.button
              onClick={() => router.push('/login?as=agent')}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(245,158,11,0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-left transition-all hover:border-amber-300 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Agente</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Guadagna commissioni portando ristoranti sulla piattaforma
              </p>
              <span className="text-amber-600 font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Accedi <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
              ← Torna alla Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Login Form (Ristoratore or Agent)
  const isAgent = loginAs === 'agent';
  const accentColor = isAgent ? 'amber' : 'blue';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      isAgent 
        ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cambia ruolo
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
              isAgent ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              {isAgent 
                ? <TrendingUp className="w-8 h-8 text-white" /> 
                : <Store className="w-8 h-8 text-white" />
              }
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {isAgent ? 'Accesso Agente' : 'Accesso Ristoratore'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isAgent 
                ? 'Gestisci i tuoi referral e commissioni' 
                : 'Gestisci il tuo ristorante con l\'AI'
              }
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400" 
                  placeholder="tuaemail@esempio.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link 
                  href="/forgot-password" 
                  className={`text-xs font-semibold transition-colors ${
                    isAgent ? 'text-amber-600 hover:text-amber-500' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Password dimenticata?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400" 
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                isAgent 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Accedi <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isAgent ? (
                <>Non hai un account? <Link href="/register-agent" className="text-amber-600 font-bold hover:text-amber-500 transition-colors">Registrati</Link></>
              ) : (
                <>Non hai ancora un account? <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-500 transition-colors">Registrati e Abbonati ora</Link></>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
