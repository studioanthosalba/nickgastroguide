'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, Rocket, Loader2, ArrowRight } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { session, error: authError } = await insforge.auth.signIn({ email, password });
      
      if (authError) throw authError;

      if (session) {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'accesso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-amber-500/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Rocket className="w-7 h-7 text-black fill-current" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">GastroGuide</span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Bentornato</h1>
          <p className="text-zinc-500 text-sm">Gestisci il tuo ristorante con la potenza dell'AI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-zinc-700" 
              placeholder="nome@ristorante.it"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors">Dimenticata?</button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-zinc-700" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Accedi <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-zinc-500 text-sm">
            Non hai ancora un account? <Link href="/recruiting" className="text-white font-bold hover:text-violet-400 transition-colors">Contattaci</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
