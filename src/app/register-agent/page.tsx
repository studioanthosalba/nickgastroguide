'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Loader2, UserPlus, Percent, RefreshCw,
  Link2, LayoutDashboard, Mail, Lock, User, CheckCircle2
} from 'lucide-react';
import { insforge } from '@/lib/insforge';

const benefits = [
  { icon: <Percent className="w-5 h-5" />, title: "40% Prima Commissione", desc: "Su ogni attivazione che generi" },
  { icon: <RefreshCw className="w-5 h-5" />, title: "10% Ricorrente", desc: "Su ogni rinnovo mensile, per sempre" },
  { icon: <Link2 className="w-5 h-5" />, title: "Link Referral", desc: "Unico e tracciabile, condividilo ovunque" },
  { icon: <LayoutDashboard className="w-5 h-5" />, title: "Dashboard Dedicata", desc: "Monitora le tue performance in tempo reale" },
];

export default function RegisterAgentPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await insforge.auth.signUp({
        email,
        password,
        name: fullName,
      });

      if (authError) throw authError;

      // After signup, we need to ensure the profile is updated with role: 'agent' 
      // and a referral_code is generated if the trigger doesn't do it automatically.
      const user = data.user;
      if (user) {
        // Generate a unique referral code for this agent
        const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Update profile with agent role, name, and referral code
        await insforge.database.from('profiles').upsert({ 
          id: user.id,
          role: 'agent',
          is_agent: true,
          username: email.split('@')[0],
          full_name: fullName,
          referral_code: refCode
        });

        // Sync is_agent flag in users table via secure RPC
        try { await insforge.database.rpc('set_user_as_agent'); } catch (_) {}
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrazione Completata!</h2>
          <p className="text-gray-500 mb-8">Controlla la tua email per verificare l'account e iniziare a guadagnare.</p>
          <Link href="/login?as=agent">
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl">
              Vai al Login
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Unisciti al Programma{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Partner
              </span>
            </h1>
            <p className="text-zinc-400 mb-12 leading-relaxed">
              Guadagna commissioni ricorrenti aiutando i ristoranti a digitalizzarsi con l'AI.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{benefit.title}</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Crea il tuo Account</h2>
            <p className="text-gray-500 text-sm">Inizia a guadagnare con GastroGuide</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Nome e Cognome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-gray-400" 
                  placeholder="Mario Rossi"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-gray-400" 
                  placeholder="tuaemail@esempio.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-gray-400" 
                  placeholder="Minimo 8 caratteri"
                  minLength={8}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Registrati come Agente <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Hai già un account?{' '}
              <Link href="/login?as=agent" className="text-amber-600 font-bold hover:text-amber-500 transition-colors">
                Accedi
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
