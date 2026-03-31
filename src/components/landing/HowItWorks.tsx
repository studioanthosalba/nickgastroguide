'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Carica il Menu",
    desc: "Incolla il testo del tuo menu o carica un file. L'AI lo trasformerà istantaneamente."
  },
  {
    num: "02",
    title: "Personalizza AI",
    desc: "Definisci il tono di voce e le informazioni locali che vuoi che il bot condivida."
  },
  {
    num: "03",
    title: "Condividi il QR",
    desc: "Stampa il codice QR per i tavoli. I clienti scansionano e iniziano a chattare."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute left-1/2 -ml-px w-px h-full bg-zinc-900 z-0 hidden md:block" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            Tre Semplici <span className="text-amber-500">Passaggi</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Il processo è studiato per essere immediato. Senza interruzioni del servizio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-20 h-20 bg-zinc-900 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-600">
                  {step.num}
                </span>
                {/* Connector for mobile/desktop UI matches */}
                <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-full -z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center tracking-tight">
                {step.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed text-center balance">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
