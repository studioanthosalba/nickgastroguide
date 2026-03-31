'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#0a0a0a] text-white">
      {/* Animated background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-200/80">L'evoluzione digitale del tuo ristorante</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            Il Menù del tuo Ristorante, <span className="text-amber-500">Evoluto con l'AI</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
            Un concierge digitale che accoglie i tuoi ospiti con il calore di una volta e la potenza dell'intelligenza artificiale. Aumenta le vendite, ottimizza il servizio e stupisci i tuoi clienti.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105">
                Inizia Ora Gratis
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all duration-300">
                Guarda la Demo
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative z-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-2 backdrop-blur-sm">
            <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
              <div className="aspect-[4/5] sm:aspect-square bg-zinc-950 flex items-center justify-center p-8">
                 <div className="absolute top-8 right-8 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 p-4 rounded-2xl animate-bounce">
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-tighter">ORDINE RICEVUTO ✨</p>
                 </div>
                 <div className="absolute bottom-12 left-8 bg-violet-500/20 backdrop-blur-md border border-violet-500/30 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-violet-500 uppercase tracking-tighter">+15% VENDITE MEDIA 📈</p>
                 </div>
                 <div className="w-48 h-48 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full flex items-center justify-center border border-white/5 relative">
                    <Rocket className="w-24 h-24 text-amber-500" />
                    <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
