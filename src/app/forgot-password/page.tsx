'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck, Key, Lock, CheckCircle2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore imprevisto nel server');

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Errore nell\'invio del codice di reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl shadow-violet-100/50 border border-gray-100 p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Codice Inviato!</h2>
            <p className="text-gray-500 text-sm mb-8">
              Controlla la tua casella <strong className="text-gray-700">{email}</strong> per il codice di reset a 6 cifre.
            </p>
            <div className="space-y-3">
              <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl w-full">
                  Inserisci Codice
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-3 bg-gray-50 text-gray-600 font-semibold rounded-xl w-full hover:bg-gray-100 transition-colors">
                  Torna al Login
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-violet-100/50 border border-gray-100 p-10">
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Recupera Password</h1>
              <p className="text-gray-500 text-sm">Inserisci la tua email per ricevere il codice di reset</p>
            </div>

            {/* Step Progress */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="w-10 h-0.5 bg-gray-200" />
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Key className="w-4 h-4 text-gray-400" />
              </div>
              <div className="w-10 h-0.5 bg-gray-200" />
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-gray-400" 
                    placeholder="tuaemail@esempio.com"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <><ArrowRight className="w-5 h-5" /> Invia Codice</>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                href="/login" 
                className="text-violet-600 font-semibold text-sm hover:text-violet-500 transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Torna al Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
